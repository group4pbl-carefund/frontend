import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="relative flex flex-col justify-center px-8 py-24 md:py-32"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('hero_1.webp')",
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
          <button className="rounded-full bg-[#147D73] px-8 py-3 font-bold text-white transition-colors hover:bg-[#0F655C]">
            MULAI DONASI
          </button>
          <button className="rounded-full border-2 border-white px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-slate-900">
            LIHAT LAPORAN
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
