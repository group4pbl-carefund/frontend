import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import SearchBar from '../components/searchBar';

const campaignData = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    category: "Pendidikan",
    title: "Bantuan Pendidikan Anak Pedalaman Kalimantan",
    description: "Program untuk memfasilitasi buku pelajaran, alat tulis, dan seragam sekolah bagi 50 murid SD di pedalaman Kalimantan Timur.",
    collectedAmount: "Rp 450 Juta",
    progressPercentage: 75,
    targetAmount: "Rp 600.000.000"
  },
  {
    id: 2,
    imageSrc: "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=600&q=80",
    category: "Kesehatan",
    title: "Air Bersih untuk Desa Terpencil NTT",
    description: "Membangun sumur bor dan saluran air bersih untuk 3 desa di Nusa Tenggara Timur yang mengalami kesulitan akses air bersih.",
    collectedAmount: "Rp 72.5 Juta",
    progressPercentage: 97,
    targetAmount: "Rp 75.000.000"
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
    category: "Bencana Alam",
    title: "Pemulihan Ekonomi Korban Banjir Aceh",
    description: "Bantuan modal usaha dan perbaikan sarana pasar untuk membantu 150 KK kembali memulihkan roda ekonomi mereka.",
    collectedAmount: "Rp 45 Juta",
    progressPercentage: 45,
    targetAmount: "Rp 100.000.000"
  },
  {
    id: 4,
    imageSrc: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    category: "Sosial",
    title: "Paket Sembako untuk Lansia Dhuafa",
    description: "Penyaluran paket sembako bulanan untuk 100 lansia yang hidup sebatang kara di wilayah pinggiran kota.",
    collectedAmount: "Rp 12 Juta",
    progressPercentage: 60,
    targetAmount: "Rp 20.000.000"
  },
  {
    id: 5,
    imageSrc: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=600&q=80",
    category: "Kesehatan",
    title: "Operasi Katarak Gratis Lansia Pesisir",
    description: "Memberikan akses operasi katarak gratis bagi 50 nelayan lansia di pesisir Pantai Selatan.",
    collectedAmount: "Rp 82.1 Juta",
    progressPercentage: 91,
    targetAmount: "Rp 90.000.000"
  },
  {
    id: 6,
    imageSrc: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80",
    category: "Lingkungan",
    title: "Penanaman 10.000 Mangrove di Bekasi",
    description: "Upaya mitigasi abrasi pantai melalui penanaman kembali hutan mangrove bersama komunitas lokal.",
    collectedAmount: "Rp 15 Juta",
    progressPercentage: 30,
    targetAmount: "Rp 50.000.000"
  }
];

const categories = ['Semua', 'Pendidikan', 'Kesehatan', 'Bencana Alam', 'Sosial', 'Lingkungan'];

const ProgramsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaignData.filter(campaign => {
    const matchesCategory = activeCategory === 'Semua' || campaign.category === activeCategory;
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F4F7F6] pb-24">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100 pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center text-sm font-bold text-[#147D73] hover:opacity-70 transition-opacity mb-4"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Beranda
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Eksplorasi Program Donasi
                </h1>
                <p className="text-slate-500 mt-2 max-w-xl">
                  Temukan berbagai inisiatif kebaikan dan jadilah bagian dari perubahan positif hari ini.
                </p>
              </div>
              
              <div className="w-full md:w-96">
                <SearchBar 
                  placeholder="Cari program donasi..." 
                  onSearch={(val) => setSearchQuery(val)}
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#147D73] text-white shadow-md shadow-[#147D73]/20'
                      : 'bg-white text-slate-500 border border-gray-200 hover:border-[#147D73] hover:text-[#147D73]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12">
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CampaignCard 
                    id={campaign.id}
                    imageSrc={campaign.imageSrc}
                    category={campaign.category}
                    title={campaign.title}
                    description={campaign.description}
                    collectedAmount={campaign.collectedAmount}
                    progressPercentage={campaign.progressPercentage}
                    targetAmount={campaign.targetAmount}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold text-slate-800">Program tidak ditemukan</h3>
              <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
              <button 
                onClick={() => {setActiveCategory('Semua'); setSearchQuery('');}}
                className="mt-6 text-[#147D73] font-bold hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramsPage;
