import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import ArticleCard from '../components/articleCard';

import SearchBar from '../components/searchBar';
import api from '../utils/api';
const EdukasiPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/education-articles');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setArticles(data);
        }
      } catch (err) {
        console.error('Failed to fetch education articles from API:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
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
      <div className="min-h-screen bg-[#F4F7F6] pb-20">      
        <div className="w-full px-8 md:px-16 lg:px-24 pt-12">
          
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
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
            
            <SearchBar onSearch={(val) => setSearchQuery(val)} />
          </div>



          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Artikel Edukasi</h2>
              <p className="text-slate-500">Update terbaru mengenai keamanan dan teknologi filantropi.</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12 text-slate-500 font-medium">
                Memuat artikel edukasi...
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.article_id || article.id}
                    id={article.article_id || article.id}
                    category={article.category || 'Umum'}
                    image={article.thumbnail_url || ''}
                    readTime={article.read_time ? `${article.read_time} menit baca` : "5 menit baca"}
                    title={article.title}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center text-slate-400 font-medium italic">
                Tidak ada artikel edukasi yang ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EdukasiPage;
