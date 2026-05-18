import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import FeaturesSection from '../components/featuresSection';
import HeroSection from '../components/heroSection';
import StatsSection from '../components/statsSection';
import { getCampaigns } from '../utils/campaignDb';

const LandingPage = () => {
  // Ambil data kampanye dinamis
  const allCampaigns = getCampaigns();
  
  // Ambil maksimal 3 kampanye dengan status 'approved' (aktif/jalan) untuk ditampilkan di beranda
  const activeCampaigns = allCampaigns.filter(c => c.status === 'approved').slice(0, 3);

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activeCampaigns.map((campaign) => {
            const collectedAmountStr = campaign.collected >= 1000000000 
              ? `Rp ${(campaign.collected / 1000000000).toFixed(1)} Miliar`
              : campaign.collected >= 1000000 
                ? `Rp ${(campaign.collected / 1000000).toFixed(1)} Juta`
                : `Rp ${campaign.collected.toLocaleString('id-ID')}`;
            
            const targetAmountStr = `Rp ${campaign.target.toLocaleString('id-ID')}`;
            const progressPercentage = Math.min(100, Math.round((campaign.collected / campaign.target) * 100));

            return (
              <CampaignCard 
                key={campaign.id}
                id={campaign.id}
                imageSrc={campaign.imageSrc || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"}
                category={campaign.category}
                title={campaign.title}
                description={campaign.description}
                collectedAmount={collectedAmountStr}
                progressPercentage={progressPercentage}
                targetAmount={targetAmountStr}
              />
            );
          })}
        </div>
      </section>
      <FeaturesSection />

    </MainLayout>
  );
};

export default LandingPage;
