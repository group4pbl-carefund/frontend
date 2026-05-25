import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import MainLayout from '../../layouts/mainLayout';
import Swal from 'sweetalert2';

import api from '../../utils/api';

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // State untuk menyimpan data artikel
  const [article, setArticle] = useState({
    title: '',
    category: 'Security',
    authorName: 'Editorial Team',
    status: 'PUBLISHED',
    featured: false,
    metaDescription: '',
    content: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data artikel dari API dengan fallback
  useEffect(() => {
    const fetchArticleDetail = async () => {
      setIsLoading(true);
      let loadedFromApi = false;

      try {
        const response = await api.get(`/education-articles/${id}`);
        const data = response.data?.data || response.data;
        if (data) {
          setArticle({
            title: data.title || '',
            category: data.category || 'Security',
            authorName: data.author?.full_name || 'Editorial Team',
            status: (data.status || 'PUBLISHED').toUpperCase(),
            featured: data.featured || false,
            metaDescription: data.metaDescription || '',
            content: data.content || ''
          });
          loadedFromApi = true;
        }
      } catch (err) {
        console.error('Gagal mengambil detail artikel dari API:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Artikel tidak ditemukan!',
          icon: 'error',
          confirmButtonColor: '#147D73'
        }).then(() => {
          navigate('/admin/edukasi/manage');
        });
      }
      setIsLoading(false);
    };

    fetchArticleDetail();
  }, [id, navigate]);

  const handleUpdate = async () => {
    const updatedContent = editorRef.current ? editorRef.current.getContent() : article.content;
    
    if (!article.title.trim()) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Judul artikel tidak boleh kosong!',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    const apiStatus = article.status === 'PUBLISHED' ? 'published' : 'draft';

    setIsSubmitting(true);
    // 1. Try backend API call
    try {
      await api.put(`/education-articles/${id}`, {
        title: article.title.trim(),
        content: updatedContent,
        category: article.category,
        status: apiStatus,
        published_at: apiStatus === 'published' ? new Date().toISOString().split('T')[0] : null
      });


      await Swal.fire({
        title: 'Sukses!',
        text: 'Artikel berhasil diperbarui!',
        icon: 'success',
        confirmButtonText: 'Kembali',
        confirmButtonColor: '#147D73'
      });
      navigate('/admin/edukasi/manage');
    } catch (err) {
      console.error("Gagal memperbarui artikel di API backend:", err);
      Swal.fire({
        title: 'Gagal Memperbarui!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menghubungi backend.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-[#F8FAFA] min-h-screen flex items-center justify-center">
          <p className="text-slate-500 font-bold">Memuat artikel...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#F8FAFA] min-h-screen pb-24 pt-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* --- BREADCRUMBS & HEADER --- */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="text-[10px] font-bold text-[#147D73] uppercase tracking-wider mb-4">
                <span className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => navigate('/admin/edukasi')}>Education</span> 
                <span className="mx-2 text-slate-300">&gt;</span> 
                <span className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => navigate('/admin/edukasi/manage')}>Content Management</span> 
                <span className="mx-2 text-slate-300">&gt;</span> 
                Edit Article
              </div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => navigate(-1)} className="hover:bg-gray-200 p-1.5 rounded-full transition-colors">
                  <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Article</h1>
              </div>
              <p className="text-slate-500 text-sm ml-11 max-w-xl">
                Perbarui artikel edukasi untuk mengedukasi ekosistem Care Fund.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-11 md:ml-0">
              <button 
                onClick={() => navigate('/admin/edukasi/manage')}
                disabled={isSubmitting}
                className={`bg-gray-200 hover:bg-gray-300 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                disabled={isSubmitting}
                className={`bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Updating...' : 'Update Changes'}
              </button>
            </div>
          </div>

          {/* --- MAIN GRID LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Editor Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form Inputs Container */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
                
                {/* Article Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Article Title</label>
                  <input 
                    type="text" 
                    value={article.title}
                    onChange={(e) => setArticle({...article, title: e.target.value})}
                    placeholder="Enter a compelling title..." 
                    className="w-full bg-slate-100 text-slate-900 font-medium py-3.5 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 transition-all border-none"
                  />
                </div>

                {/* Category & Author Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <div className="relative">
                      <select 
                        value={article.category}
                        onChange={(e) => setArticle({...article, category: e.target.value})}
                        className="w-full bg-slate-100 text-slate-900 font-medium py-3.5 px-5 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 border-none cursor-pointer"
                      >
                        <option value="Security">Security</option>
                        <option value="Regulation">Regulation</option>
                        <option value="Payment">Payment</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Author</label>
                    <div className="w-full bg-slate-100/50 text-slate-500 font-medium py-3.5 px-5 rounded-xl border border-slate-200">
                      {article.authorName}
                    </div>
                  </div>
                </div>

              </div>

              {/* TinyMCE Editor Container */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  apiKey="d143e92dnddl4y0biuhw6rhlc2csc0z8saq2p4lmc5bf9xn7"
                  initialValue={article.content}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'bold italic underline strikethrough  | bullist numlist | link image | alignleft aligncenter alignright alignjustify | removeformat',
                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; }',
                    skin: 'oxide',
                    border: 'none',
                    statusbar: false,
                  }}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: Sidebar Settings */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Featured Image */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Featured Image</label>
                <div className="border-2 border-dashed border-gray-200 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors group relative overflow-hidden h-48">
                  <img src="https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=600&q=80" alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                  <div className="relative z-10">
                    <svg className="w-8 h-8 text-[#147D73] mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="font-bold text-slate-700 mb-1 text-sm">Replace featured image</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Status & Options */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
                
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Publish Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={article.status === 'PUBLISHED'} 
                        onChange={(e) => setArticle({...article, status: e.target.checked ? 'PUBLISHED' : 'DRAFT'})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#147D73]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Featured Article</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={article.featured}
                        onChange={(e) => setArticle({...article, featured: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#147D73]"></div>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Meta Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description</label>
                  <textarea 
                    rows="3" 
                    value={article.metaDescription}
                    onChange={(e) => setArticle({...article, metaDescription: e.target.value})}
                    placeholder="Brief summary for search results..." 
                    className="w-full bg-slate-100 text-slate-600 text-sm py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 border-none resize-none"
                  ></textarea>
                </div>

              </div>

              {/* SEO Preview Widget */}
              <div className="bg-[#E8F3F1] p-6 rounded-3xl border border-[#D1E8E4]">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-[#147D73] uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  SEO Snippet Preview
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1A0DAB] truncate cursor-pointer hover:underline">{article.title || 'Untitled'}</h4>
                  <div className="text-xs text-[#006621] truncate">carefund.org &gt; articles &gt; {id}</div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {article.metaDescription || 'No description provided.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditArticlePage;
