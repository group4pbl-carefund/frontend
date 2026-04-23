import React from 'react';

// Data Dummy untuk fitur-fitur
const featuresData = [
  {
    id: 1,
    title: "100% Transparan",
    description: "Akses laporan keuangan terperinci kapan saja. Lihat setiap rupiah yang Anda berikan sampai ke tujuan.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Aman & Terverifikasi",
    description: "Seluruh kampanye melalui proses audit ketat untuk memastikan tidak ada penipuan dalam penyaluran.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Cepat & Mudah",
    description: "Berbagai pilihan pembayaran digital terintegrasi. Berbagi kebaikan hanya butuh hitungan detik.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-24 px-8">
      {/* Bagian Judul (Header) */}
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
          Mengapa Memilih CareFund?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed md:text-base">
          Kepercayaan Anda adalah prioritas kami. Kami membangun ekosistem donasi digital berbasis kejujuran.
        </p>
      </div>

      {/* Bagian Grid Fitur */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
        {featuresData.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center text-center px-4">
            
            {/* Lingkaran Ikon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 text-[#60C9B3]">
              {feature.icon}
            </div>
            
            {/* Teks Fitur */}
            <h3 className="mb-3 text-lg font-bold text-[#0F172A]">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
              {feature.description}
            </p>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;