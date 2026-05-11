import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import FeaturesSection from '../components/featuresSection';
import HeroSection from '../components/heroSection';
import StatsSection from '../components/statsSection';

const campaignData = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    category: "Pendidikan",
    title: "Bantuan Pendidikan Anak Pedalaman",
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
  }
];

const LandingPage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />

      <section className="px-8 py-16 md:px-16 lg:px-24 bg-white">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Program donasi aktif</h2>
          <p className="text-md text-slate-600 mt-1">Pilih program yang ingin Anda dukung</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaignData.map((campaign) => (
            <CampaignCard 
              key={campaign.id}
              id={campaign.id}
              imageSrc={campaign.imageSrc}
              category={campaign.category}
              title={campaign.title}
              description={campaign.description}
              collectedAmount={campaign.collectedAmount}
              progressPercentage={campaign.progressPercentage}
              targetAmount={campaign.targetAmount}
            />
          ))}
        </div>
      </section>
      <FeaturesSection />

    </MainLayout>
  );
};

export default LandingPage;
