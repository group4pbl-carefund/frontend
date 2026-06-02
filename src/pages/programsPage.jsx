import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import SearchBar from '../components/searchBar';
import api from '../utils/api';
import { formatRupiah, formatRupiahFull } from '../utils/format';
import { useMemo } from 'react';

const ProgramsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'Semua';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [location.search]);

  const [searchQuery, setSearchQuery] = useState('');

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    const cats = allCampaigns
      .map(c => c.program?.category || c.category)
      .filter(Boolean);
    return ['Semua', ...new Set(cats)];
  }, [allCampaigns]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/program-campaigns');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setAllCampaigns(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data kampanye:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filter hanya kampanye dengan status 'approved' atau 'active' dan belum kedaluwarsa
  const activeCampaigns = allCampaigns.filter(c => {
    const status = c.program?.status || c.status;
    let isNotExpired = true;
    const endDateStr = c.program?.end_date || c.end_date;
    if (endDateStr) {
        const endDate = new Date(endDateStr);
        const now = new Date();
        if (endDate < now) {
            isNotExpired = false;
        }
    }
    return (status === 'approved' || status === 'active') && isNotExpired;
  });

  const filteredCampaigns = activeCampaigns.filter(campaign => {
    const campaignCategory = campaign.program?.category || campaign.category || 'Umum';
    const matchesCategory = activeCategory === 'Semua' ||
      campaignCategory.toLowerCase() === activeCategory.toLowerCase();

    const title = campaign.program?.program_name || campaign.title || '';
    const desc = campaign.program?.description || campaign.description || '';

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
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
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat
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
          {loading ? (
            <div className="flex justify-center items-center py-20 text-slate-500 font-bold">
              Memuat data program...
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => {
                const collected = campaign.current_amount || campaign.collected || 0;
                const target = campaign.program?.target_amount || campaign.target || 1;
                
                const collectedAmountStr = formatRupiah(collected);
                const targetAmountStr = formatRupiahFull(target);
                const progressPercentage = Math.min(100, Math.round((collected / target) * 100));

                return (
                  <div key={campaign.campaign_id || campaign.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CampaignCard
                      id={campaign.campaign_id || campaign.id}
                      imageSrc={campaign.program?.image_url || campaign.imageSrc || ''}
                      category={campaign.program?.category || campaign.category || 'Umum'}
                      title={campaign.program?.program_name || campaign.title}
                      description={campaign.program?.description || campaign.description}
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
                onClick={() => { setActiveCategory('Semua'); setSearchQuery(''); }}
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
