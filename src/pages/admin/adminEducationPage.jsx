import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainLayout';
import ArticleCard from '../../components/articleCard';
import api from '../../utils/api';

const AdminEdukasiPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/education-articles');
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch education articles from API:', err);
        setArticles([]);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const publishedArticles = articles.filter(a => (a.status || '').toUpperCase() === 'PUBLISHED');

  const filteredArticles = publishedArticles.filter(article => {
    const title = article.title || '';
    const category = article.category || '';
    const subtitle = article.content ? article.content.substring(0, 50) : '';
    
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           category.toLowerCase().includes(searchQuery.toLowerCase()) ||
           subtitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <MainLayout>
      <div className="bg-[#F4F7F6] pb-20 min-h-screen">
        <div className="w-full px-8 md:px-16 lg:px-24 pt-12">
          
          {/* --- HEADER SECTION --- */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Pusat Edukasi Literasi Digital
              </h1>
            </div>
            
            <p className="text-slate-600 text-lg max-w-2xl mb-8">
              Panduan lengkap untuk belajar berdonasi dengan aman dan transparan di ekosistem digital Care Fund.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari artikel edukasi..."
                className="block w-full pl-11 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#147D73] focus:border-[#147D73] sm:text-sm transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* --- ADMIN ACTION BUTTON --- */}
          {/* Ini adalah bagian baru yang ditambahkan: Tombol rata kanan */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => navigate('/admin/edukasi/manage')} // Arahkan ke halaman CRUD/Manage kamu nantinya
              className="bg-[#12A08E] hover:bg-[#0E8071] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200"
            >
              Manage Content
            </button>
          </div>



          {/* --- ARTICLES SECTION --- */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Artikel Edukasi</h2>
              <p className="text-slate-500">Update terbaru mengenai keamanan dan teknologi filantropi.</p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.article_id}
                    id={article.article_id}
                    category={article.category || 'Umum'}
                    image={article.thumbnail_url || ''}
                    readTime={article.read_time ? `${article.read_time} menit baca` : "5 menit baca"}
                    title={article.title}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center text-slate-400 font-medium italic">
                Tidak ada artikel edukasi yang ditemukan untuk kata kunci tersebut.
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminEdukasiPage;