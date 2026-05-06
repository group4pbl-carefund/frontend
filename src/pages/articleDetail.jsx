import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';

const ArtikelDetail = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Background utama menyesuaikan warna desain yang agak keabu-abuan/mint terang */}
      <div className="bg-[#F6F9F8] min-h-screen pb-24 pt-10">
        
        {/* Container Utama */}
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          
          {/* --- BAGIAN HEADER & JUDUL --- */}
          <div className="mb-8">
            {/* Tombol Back */}
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center text-sm font-bold text-[#147D73] hover:opacity-80 transition-opacity mb-6"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Pusat Edukasi
            </button>

            {/* Badges / Tags */}
            <div className="flex gap-3 mb-4">
              <span className="bg-[#C6F0E5] text-[#0F655C] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Keamanan
              </span>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Digital
              </span>
            </div>

            {/* Judul Artikel */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Cara Berdonasi dengan Aman di Era Digital
            </h1>

            {/* Meta Info Penulis */}
            <div className="flex items-center gap-3">
              <img 
                src="https://ui-avatars.com/api/?name=Anisa+Rahmawati&background=333&color=fff" 
                alt="Anisa Rahmawati" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">Anisa Rahmawati</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  24 Okt 2024 <span className="mx-1.5">•</span> 5 menit baca
                </p>
              </div>
            </div>
          </div>

          {/* --- GAMBAR HERO --- */}
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80" 
              alt="Ilustrasi Artikel" 
              className="w-full aspect-21/9 object-cover rounded-xl shadow-sm"
            />
          </div>

          {/* --- LAYOUT DUA KOLOM (KONTEN & SIDEBAR) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* KOLOM KIRI: Konten Utama Artikel (Makan 2 kolom) */}
            <article className="lg:col-span-2 text-slate-700 text-[15px] md:text-base leading-relaxed">
              
              <p className="mb-6">
                Meningkatnya kesadaran sosial di era digital telah mempermudah siapapun untuk berkontribusi bagi kemanusiaan. Namun, kemudahan ini juga menuntut kewaspadaan lebih tinggi terhadap potensi penipuan digital yang semakin canggih.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                Mengapa Keamanan Berdonasi Itu Penting?
              </h2>
              <p className="mb-6">
                Trust atau kepercayaan adalah pondasi dari setiap gerakan filantropi. Di Care Fund, kami percaya bahwa setiap rupiah yang Anda donasikan harus sampai kepada mereka yang membutuhkan dengan transparan dan aman.
              </p>

              {/* Blockquote / Kutipan */}
              <blockquote className="border-l-2 border-[#147D73] pl-5 py-1 my-8">
                <p className="text-lg font-medium text-[#147D73] leading-snug">
                  "Keamanan digital bukan lagi sebuah pilihan, melainkan keharusan bagi setiap platform sosial yang ingin menjaga integritas dan kepercayaan donaturnya."
                </p>
              </blockquote>

              <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                Langkah Praktis Menjaga Keamanan
              </h2>
              <p className="mb-4">
                Berikut adalah beberapa langkah yang dapat Anda lakukan untuk memastikan donasi Anda diproses melalui jalur yang tepat:
              </p>
              <ul className="list-disc pl-5 mb-8 space-y-2 marker:text-[#147D73]">
                <li>Verifikasi URL situs web (pastikan dimulai dengan https://).</li>
                <li>Gunakan metode pembayaran yang terintegrasi dan resmi.</li>
                <li>Cek laporan transparansi tahunan organisasi tersebut.</li>
                <li>Hindari memberikan informasi pribadi yang berlebihan seperti PIN atau password.</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                Fitur Keamanan di Care Fund
              </h2>
              <p className="mb-4">
                Kami menerapkan standar enkripsi tingkat tinggi untuk setiap transaksi. Tim audit kami secara berkala melakukan pengecekan terhadap validitas program yang terdaftar, memastikan setiap kampanye telah melewati proses kurasi yang ketat.
              </p>
              <p className="mb-12">
                Selain teknologi, edukasi kepada komunitas adalah kunci. Dengan memahami cara kerja platform, Anda menjadi garda terdepan dalam menjaga ekosistem kebaikan ini tetap bersih dari penyalahgunaan digital.
              </p>

              {/* --- BAGIAN FOOTER ARTIKEL (Share & Tags) --- */}
              <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-wider text-slate-900">BAGIKAN:</span>
                  <button className="text-slate-500 hover:text-[#147D73] transition-colors">
                    {/* Ikon Share/Cabang */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button className="text-slate-500 hover:text-[#147D73] transition-colors">
                    {/* Ikon Link/Tautan */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </button>
                </div>
                
                <div className="flex gap-3 text-xs text-slate-500 font-medium">
                  <span>#Edukasi</span>
                  <span>#Philanthropy</span>
                  <span>#Security</span>
                </div>
              </div>

            </article>

            {/* KOLOM KANAN: Sidebar CTA (Makan 1 kolom) */}
            <aside className="lg:col-span-1">
              {/* 'sticky top-24' membuat kotak ini tetap terlihat saat user men-scroll ke bawah */}
              <div onClick={() => navigate('/')} className="bg-[#A4EBE0] rounded-2xl p-8 sticky top-24 shadow-sm">
                <h3 className="text-xl font-bold text-[#0D5C54] mb-3">
                  Mulai Berbagi Sekarang
                </h3>
                <p className="text-[#0D5C54] text-sm leading-relaxed mb-6 opacity-90">
                  Kontribusi Anda, sekecil apapun, akan membawa perubahan nyata bagi mereka yang membutuhkan.
                </p>
                <button className="w-full bg-[#0F766E] hover:bg-[#0B5C55] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                  Pilih Program Donasi
                </button>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ArtikelDetail;