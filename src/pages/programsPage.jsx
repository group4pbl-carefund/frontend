import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import SearchBar from '../components/searchBar';
import { getCampaigns } from '../utils/campaignDb';

const categories = ['Semua', 'Pendidikan', 'Kesehatan', 'Bencana Alam', 'Sosial', 'Lingkungan'];

const ProgramsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Ambil data kampanye dinamis
  const allCampaigns = getCampaigns();
  
  // Filter hanya kampanye dengan status 'approved' (status masih jalan dan aktif)
  const activeCampaigns = allCampaigns.filter(c => c.status === 'approved');

  const filteredCampaigns = activeCampaigns.filter(campaign => {
    const matchesCategory = activeCategory === 'Semua' || 
      campaign.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description && campaign.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
                  Temukan berbagai inisiatif kebaikan yang aktif dan jadilah bagian dari perubahan positif hari ini.
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
              {filteredCampaigns.map((campaign) => {
                const collectedAmountStr = campaign.collected >= 1000000000 
                  ? `Rp ${(campaign.collected / 1000000000).toFixed(1)} Miliar`
                  : campaign.collected >= 1000000 
                    ? `Rp ${(campaign.collected / 1000000).toFixed(1)} Juta`
                    : `Rp ${campaign.collected.toLocaleString('id-ID')}`;
                
                const targetAmountStr = `Rp ${campaign.target.toLocaleString('id-ID')}`;
                const progressPercentage = Math.min(100, Math.round((campaign.collected / campaign.target) * 100));

                return (
                  <div key={campaign.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CampaignCard 
                      id={campaign.id}
                      imageSrc={campaign.imageSrc || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"}
                      category={campaign.category}
                      title={campaign.title}
                      description={campaign.description}
                      collectedAmount={collectedAmountStr}
                      progressPercentage={progressPercentage}
                      targetAmount={targetAmountStr}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold text-slate-800">Program Tidak Ditemukan</h3>
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
