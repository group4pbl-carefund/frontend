import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import ArticleCard from '../components/articleCard';
import CategoryCard from '../components/categoryCard';
import SearchBar from '../components/searchBar';
import { getArticles } from '../utils/articleDb';

const categoryCards = [
  {
    id: 1,
    title: 'Keamanan Donasi',
    description: 'Cara melindungi data dan memastikan dana Anda sampai ke tujuan.',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    iconBg: 'bg-blue-50',
    linkColor: 'text-blue-600',
    linkText: 'Eksplorasi Modul',
  },
  {
    id: 2,
    title: 'Regulasi KYC',
    description: 'Memahami standar identifikasi untuk transparansi dana bantuan.',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: 'bg-purple-50',
    linkColor: 'text-purple-600',
    linkText: 'Pelajari Aturan',
  },
  {
    id: 3,
    title: 'Payment Gateway',
    description: 'Metode pembayaran yang didukung dan biaya pemrosesan.',
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    iconBg: 'bg-emerald-50',
    linkColor: 'text-emerald-600',
    linkText: 'Lihat Panduan',
  },
];

const EdukasiPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Dapatkan seluruh artikel yang terbit
  const publishedArticles = getArticles().filter(a => a.status === 'PUBLISHED');

  // Filter berdasarkan input search
  const filteredArticles = publishedArticles.filter(article => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (article.subtitle && article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categoryCards.map((card) => (
              <CategoryCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                iconBg={card.iconBg}
                linkColor={card.linkColor}
                linkText={card.linkText}
              />
            ))}
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Artikel Edukasi</h2>
              <p className="text-slate-500">Update terbaru mengenai keamanan dan teknologi filantropi.</p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id}
                    id={article.id}
                    category={article.category}
                    image={article.image || 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=600&q=80'}
                    readTime="5 menit baca"
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

export default EdukasiPage;
