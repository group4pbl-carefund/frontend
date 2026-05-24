import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import FeaturesSection from '../components/featuresSection';
import HeroSection from '../components/heroSection';
import StatsSection from '../components/statsSection';
import api from '../utils/api'; 

const LandingPage = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/program-campaigns')
      .then((res) => {
        const allCampaigns = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        const filtered = allCampaigns
          .filter(c => c.status === 'approved')
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
              // 4. Data Mapping variabel dari Backend (Sesuaikan nama kolom database kalian jika berbeda)
              const collected = Number(campaign.collected || campaign.current_donation || 0);
              const target = Number(campaign.target || campaign.target_donation || 1);
              
              const collectedAmountStr = collected >= 1000000000 
                ? `Rp ${(collected / 1000000000).toFixed(1)} Miliar`
                : collected >= 1000000 
                  ? `Rp ${(collected / 1000000).toFixed(1)} Juta`
                  : `Rp ${collected.toLocaleString('id-ID')}`;
              
              const targetAmountStr = `Rp ${target.toLocaleString('id-ID')}`;
              const progressPercentage = Math.min(100, Math.round((collected / target) * 100));

              return (
                <CampaignCard 
                  key={campaign.id}
                  id={campaign.id}
                  imageSrc={campaign.imageSrc || campaign.image_url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"}
                  category={campaign.category?.name || campaign.category || "Umum"}
                  title={campaign.title}
                  description={campaign.description}
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