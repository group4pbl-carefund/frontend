import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: 'Transparan',
      description: 'Semua dana donasi dan penyalurannya dicatat secara terbuka dan dapat dipantau langsung oleh publik.',
    },
    {
      id: 2,
      title: 'Aman & Terpercaya',
      description: 'Menggunakan sistem enkripsi dan keamanan standar tinggi untuk memastikan data serta dana Anda selalu aman.',
    },
    {
      id: 3,
      title: 'Mudah & Cepat',
      description: 'Berdonasi kapan saja hanya dengan beberapa klik menggunakan berbagai metode pembayaran digital pilihan Anda.',
    }
  ];

  return (
    <section className="bg-white py-24 px-8">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
          Mengapa Memilih CareFund?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed md:text-base">
          Kepercayaan Anda adalah prioritas kami. Kami membangun ekosistem donasi digital berbasis kejujuran.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center text-center px-4">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 text-[#60C9B3]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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