import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import MainLayout from '../../layouts/mainLayout';
import Swal from 'sweetalert2';

import api from '../../utils/api';

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Security',
    authorName: 'Editorial Team',
    status: 'PUBLISHED',
    featured: false,
    metaDescription: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const handleSave = async (isDraft = false) => {
    const editorContent = editorRef.current ? editorRef.current.getContent() : '';
    
    if (!formData.title.trim()) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Judul artikel wajib diisi!',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    // Determine author ID from currently logged-in user or default to 1
    let authorId = 1;
    try {
      const loggedUser = localStorage.getItem('user');
      if (loggedUser) {
        const u = JSON.parse(loggedUser);
        if (u && u.id) {
          authorId = u.id;
        }
      }
    } catch (e) {
      console.warn("Gagal parse logged in user", e);
    }

    const apiStatus = isDraft ? 'draft' : (formData.status === 'PUBLISHED' ? 'published' : 'draft');

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('content', editorContent);
      payload.append('category', formData.category);
      payload.append('author_id', authorId);
      payload.append('status', apiStatus);
      payload.append('published_at', apiStatus === 'published' ? new Date().toISOString().split('T')[0] : '');
      if (thumbnailFile) {
        payload.append('thumbnail', thumbnailFile);
      }
      await api.post('/education-articles', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });


      await Swal.fire({
        title: 'Sukses!',
        text: isDraft ? 'Artikel berhasil disimpan sebagai Draft!' : 'Artikel berhasil diterbitkan secara live!',
        icon: 'success',
        confirmButtonText: 'Kembali ke Manage',
        confirmButtonColor: '#147D73'
      });

      navigate('/admin/edukasi/manage');
    } catch (err) {
      console.error("Gagal menyimpan artikel ke API backend:", err);
      Swal.fire({
        title: 'Gagal Menyimpan!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menghubungi backend.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Create New Article
              </div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => navigate(-1)} className="hover:bg-gray-200 p-1.5 rounded-full transition-colors">
                  <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Article</h1>
              </div>
              <p className="text-slate-500 text-sm ml-11 max-w-xl">
                Tulis artikel edukasi baru untuk mengedukasi ekosistem Care Fund.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-11 md:ml-0">
              <button 
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
                className={`bg-gray-200 hover:bg-gray-300 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save as Draft
              </button>
              <button 
                onClick={() => handleSave(false)} 
                disabled={isSubmitting}
                className={`bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Processing...' : 'Publish'}
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
                    placeholder="Enter a compelling title..." 
                    className="w-full bg-slate-100 text-slate-900 font-medium py-3.5 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 transition-all border-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Category & Author Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-100 text-slate-900 font-medium py-3.5 px-5 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 border-none cursor-pointer"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      Otomatis tersimpan sebagai akun Anda
                    </div>
                  </div>
                </div>

              </div>

              {/* TinyMCE Editor Container */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  apiKey="d143e92dnddl4y0biuhw6rhlc2csc0z8saq2p4lmc5bf9xn7"
                  initialValue="<p>Mulai menulis artikel edukasi di sini...</p>"
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
                    images_upload_handler: (blobInfo) => new Promise((resolve, reject) => {
                      const formData = new FormData();
                      formData.append('file', blobInfo.blob(), blobInfo.filename());
                      api.post('/upload-editor-image', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      }).then((res) => {
                        resolve(res.data.location);
                      }).catch((err) => {
                        reject('Upload gagal: ' + (err.response?.data?.message || err.message));
                      });
                    }),
                  }}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: Sidebar Settings */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Featured Image */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Featured Image</label>
                <label className="border-2 border-dashed border-gray-200 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  {thumbnailPreview ? (
                    <div className="w-full flex flex-col items-center">
                      <img src={thumbnailPreview} alt="Preview" className="max-h-48 rounded-xl object-contain shadow-md mb-4" />
                      <span className="text-xs font-bold text-[#147D73] px-3 py-1 rounded-full hover:bg-teal-100 transition-colors">Ganti Gambar</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#147D73] mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <p className="font-bold text-slate-700 mb-1">Click to upload image</p>
                      <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setThumbnailFile(file);
                      setThumbnailPreview(URL.createObjectURL(file));
                    }
                  }} />
                </label>
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
                        checked={formData.status === 'PUBLISHED'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'PUBLISHED' : 'DRAFT' })}
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
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
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
                    placeholder="Brief summary for search results..." 
                    className="w-full bg-slate-100 text-slate-600 text-sm py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 border-none resize-none"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  ></textarea>
                </div>

              </div>

              {/* SEO Preview Widget */}
              <div className="bg-[#E8F3F1] p-6 rounded-3xl border border-[#D1E8E4]">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-[#147D73] uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Live SEO Preview
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1A0DAB] truncate cursor-pointer hover:underline">{formData.title || 'New Article Title'} • Education Center</h4>
                  <div className="text-xs text-[#006621] truncate">carefund.org &gt; articles &gt; new</div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {formData.metaDescription || 'The meta description you write above will appear here in search engine results to help users.'}
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

export default CreateArticlePage;