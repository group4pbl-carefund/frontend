import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import FeaturesSection from '../components/featuresSection';
import HeroSection from '../components/heroSection';
import StatsSection from '../components/statsSection';
import api from '../utils/api';
import { formatRupiah, formatRupiahFull } from '../utils/format';

const LandingPage = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/program-campaigns')
      .then((res) => {
        const allCampaigns = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        const filtered = allCampaigns
          .filter(c => c.program?.status === 'approved' || c.status === 'approved')
          .slice(0, 3);
          
        setActiveCampaigns(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data dari backend:", err);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />

      <section className="px-8 py-16 md:px-16 lg:px-24 bg-white">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">Program donasi aktif</h2>
            <p className="text-md text-slate-600 mt-1">Pilih program yang ingin Anda dukung</p>
          </div>
          <Link to="/donasi" className="text-sm font-bold text-[#147D73] hover:underline flex items-center gap-1 group">
            Lihat Semua 
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>

        {/* Indikator Loading */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            Memuat program donasi dari Care Fund...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((campaign) => {
              const collected = Number(campaign.current_amount || campaign.collected || 0);
              const target = Number(campaign.program?.target_amount || campaign.target || 1);
              
              const collectedAmountStr = formatRupiah(collected);
              const targetAmountStr = formatRupiahFull(target);
              const progressPercentage = Math.min(100, Math.round((collected / target) * 100));

              return (
                <CampaignCard 
                  key={campaign.campaign_id || campaign.id}
                  id={campaign.campaign_id || campaign.id}
                  imageSrc={campaign.program?.image_url || campaign.imageSrc || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"}
                  category={campaign.program?.category || campaign.category || "Umum"}
                  title={campaign.program?.program_name || campaign.title}
                  description={campaign.program?.description || campaign.description}
                  collectedAmount={collectedAmountStr}
                  progressPercentage={progressPercentage}
                  targetAmount={targetAmountStr}
                />
              );
            })}
          </div>
        )}
      </section>
      
      <featuresSection />
    </MainLayout>
  );
};

export default LandingPage;