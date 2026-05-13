import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainLayout';
import ArticleCard from '../../components/articleCard';

// --- DATA DUMMY ---
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

const articleCards = [
  {
    id: 1,
    category: 'Keamanan',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=600&q=80',
    readTime: '5 menit baca',
    title: 'Cara Berdonasi dengan Aman di Era Digital',
  },
  {
    id: 2,
    category: 'Regulasi',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    readTime: '8 menit baca',
    title: 'Mengapa KYC Sangat Penting Bagi Donatur?',
  },
  {
    id: 3,
    category: 'Teknologi',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    readTime: '6 menit baca',
    title: 'Teknologi Blockchain dalam Transparansi Donasi',
  },
];

const AdminEdukasiPage = () => {
  const navigate = useNavigate();

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

          {/* --- CATEGORY CARDS SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categoryCards.map((card) => (
              <div key={card.id} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
                  {card.description}
                </p>
                <div className={`inline-flex items-center text-sm font-bold ${card.linkColor}`}>
                  {card.linkText}
                  <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* --- ARTICLES SECTION --- */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Artikel Edukasi</h2>
              <p className="text-slate-500">Update terbaru mengenai keamanan dan teknologi filantropi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articleCards.map((article) => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  category={article.category}
                  image={article.image}
                  readTime={article.readTime}
                  title={article.title}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminEdukasiPage;