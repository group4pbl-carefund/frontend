import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import api from '../utils/api';

const ArtikelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleAndRecordView = async () => {
      try {
        const response = await api.get(`/education-articles/${id}`);
        const articleData = response.data?.data || response.data;
        setArticle(articleData);

        // Record view if user is logged in
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            await api.post('/education-views', { article_id: id, user_id: user.id });
          }
        }
      } catch (error) {
        console.error('Failed to fetch article or record view:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleAndRecordView();
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-[#F6F9F8] min-h-screen pb-24 pt-20 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#147D73]"></div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="bg-[#F6F9F8] min-h-screen pb-24 pt-20 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Artikel Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8 max-w-sm">Maaf, artikel edukasi yang Anda cari tidak ada atau telah dihapus.</p>
          <button 
            onClick={() => navigate('/edukasi')}
            className="bg-[#147D73] hover:bg-[#0c5952] text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Kembali ke Pusat Edukasi
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Background utama menyesuaikan warna desain yang agak keabu-abuan/mint terang */}
      <div className="bg-[#F6F9F8] min-h-screen pb-24 pt-10">
        
        {/* Container Utama */}
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          
          {/* --- BAGIAN HEADER & JUDUL --- */}
          <div className="mb-8">
            {/* Tombol Back */}
            <button 
              onClick={() => navigate('/edukasi')}
              className="group flex items-center text-sm font-bold text-[#147D73] hover:opacity-80 transition-opacity mb-6"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Pusat Edukasi
            </button>

            {/* Badges / Tags */}
            <div className="flex gap-3 mb-4">
              <span className="bg-[#C6F0E5] text-[#0F655C] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {article.category || 'Edukasi'}
              </span>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Digital Literasi
              </span>
            </div>

            {/* Judul Artikel */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta Info Penulis */}
            <div className="flex items-center gap-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${article.author?.full_name || 'Admin'}&background=147D73&color=fff`} 
                alt={article.author?.full_name || 'Admin CareFund'} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{article.author?.full_name || 'Admin CareFund'}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})} <span className="mx-1.5">•</span> {article.read_time ? `${article.read_time} menit baca` : '5 menit baca'}
                </p>
              </div>
            </div>
          </div>

          {/* --- GAMBAR HERO --- */}
          <div className="mb-12">
            <img 
              src={article.thumbnail_url || 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=1200&q=80'} 
              alt="Ilustrasi Artikel" 
              className="w-full aspect-21/9 object-cover rounded-xl shadow-sm"
            />
          </div>

          {/* --- LAYOUT DUA KOLOM (KONTEN & SIDEBAR) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* KOLOM KIRI: Konten Utama Artikel (Makan 2 kolom) */}
            <article className="lg:col-span-2 text-slate-700 text-[15px] md:text-base leading-relaxed">
              
              <div 
                className="prose max-w-none space-y-6"
                dangerouslySetInnerHTML={{ __html: article.content || '<p>Tidak ada konten artikel.</p>' }}
              />

              {/* --- BAGIAN FOOTER ARTIKEL (Share & Tags) --- */}
              <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-12">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-wider text-slate-900">BAGIKAN:</span>
                  <button className="text-slate-500 hover:text-[#147D73] transition-colors">
                    {/* Ikon Share/Cabang */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button className="text-slate-500 hover:text-[#147D73] transition-colors">
                    {/* Ikon Link/Tautan */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </button>
                </div>
                
                <div className="flex gap-3 text-xs text-slate-500 font-medium">
                  <span>#Edukasi</span>
                  <span>#{article.category}</span>
                  <span>#CareFund</span>
                </div>
              </div>

            </article>

            {/* KOLOM KANAN: Sidebar CTA (Makan 1 kolom) */}
            <aside className="lg:col-span-1">
              {/* 'sticky top-24' membuat kotak ini tetap terlihat saat user men-scroll ke bawah */}
              <div onClick={() => navigate('/donasi')} className="bg-[#A4EBE0] rounded-2xl p-8 sticky top-24 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-[#0D5C54] mb-3">
                  Mulai Berbagi Sekarang
                </h3>
                <p className="text-[#0D5C54] text-sm leading-relaxed mb-6 opacity-90">
                  Kontribusi Anda, sekecil apapun, akan membawa perubahan nyata bagi mereka yang membutuhkan.
                </p>
                <button className="w-full bg-[#0F766E] hover:bg-[#0B5C55] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                  Pilih Program Donasi
                </button>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ArtikelDetail;