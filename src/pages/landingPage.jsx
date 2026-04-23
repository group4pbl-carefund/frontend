import React from 'react';
import MainLayout from '../layouts/mainLayout';
import CampaignCard from '../components/donationCard';
import FeaturesSection from '../components/featuresSection';

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
      {/* HERO SECTION*/}
      <section 
        className="relative flex flex-col justify-center px-8 py-24 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
            Wujudkan Kebaikan, Berbagi dengan Transparan
          </h1>
          <p className="mb-8 text-lg text-gray-200">
            Platform donasi digital terpercaya dengan sistem transparansi penuh dan diawasi Bank Indonesia serta OJK
          </p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button className="rounded-full bg-[#60C9B3] px-8 py-3 font-bold text-white transition-colors hover:bg-[#4ea894]">
              MULAI DONASI
            </button>
            <button className="rounded-full border-2 border-white px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-slate-900">
              LIHAT LAPORAN
            </button>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="flex flex-col items-center justify-center space-y-6 bg-white py-10 shadow-sm md:flex-row md:space-x-24 md:space-y-0">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#60C9B3]">2 Miliar +</h2>
          <p className="text-sm font-medium text-slate-600 mt-1">Total Dana Terkumpul</p>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#60C9B3]">10.000 +</h2>
          <p className="text-sm font-medium text-slate-600 mt-1">Penerima manfaat</p>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#60C9B3]">2.500 +</h2>
          <p className="text-sm font-medium text-slate-600 mt-1">Donatur aktif</p>
        </div>
      </section>

      {/* PROGRAM DONASI AKTIF */}
     <section className="px-8 py-16 md:px-16 lg:px-24 bg-white">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Program donasi aktif</h2>
          <p className="text-md text-slate-600 mt-1">Pilih program yang ingin Anda dukung</p>
        </div>

        {/* Gunakan .map() untuk merender kartu berdasarkan data array di atas */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaignData.map((campaign) => (
            <CampaignCard 
              key={campaign.id}
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
      
      {/* --- MENGAPA MEMILIH CAREFUND --- */}
   
   { /*  <section className="bg-white py-20 px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Mengapa Memilih CareFund?</h2>
          <p className="text-slate-500">
            Kepercayaan Anda adalah prioritas kami. Kami membangun ekosistem filantropi berbasis kejujuran.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
          /* Feature 1 
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border border-gray-100">
              <svg className="h-8 w-8 text-[#60C9B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">100% Transparan</h3>
            <p className="text-sm text-slate-500">Akses laporan keuangan terperinci kapan saja. Lihat setiap rupiah yang Anda berikan sampai ke tujuan.</p>
          </div>
           Tambahkan Feature 2 dan 3 di sini 
        </div>
      </section> */}
      <FeaturesSection />

    </MainLayout>
  );
};

export default LandingPage;