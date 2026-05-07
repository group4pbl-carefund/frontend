import React, { useState } from "react"; // Pastikan useState di-import
import MainLayout from "../layouts/mainLayout";
import { 
  ArrowLeft, Mail, Phone, MapPin, History, Award, 
  HandHeart, Calendar, CheckCircle2, ChevronRight, 
  Settings, CreditCard, LogOut, Download, Share2, Heart 
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/statCard";
import DonationHistoryItem from "../components/donationHistoryItem";

const certificateData = [
    {
        id: 1,
        title: "Bantuan Pendidikan Anak Pedalaman...",
        amount: "Rp 500.000",
        image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=400"
    },
    {
        id: 2,
        title: "Air Bersih untuk Desa Terpencil...",
        amount: "Rp 250.000",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400"
    },
    {
        id: 3,
        title: "Pemulihan Ekonomi Korban...",
        amount: "Rp 1.000.000",
        image: "https://images.unsplash.com/photo-1518111244092-26a9926c48f2?q=80&w=400"
    }
];

const donationData = [
    {
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80",
        category: "Pendidikan",
        categoryColor: "text-blue-600",
        bgColor: "bg-blue-50",
        date: "28 Mar 2026",
        title: "Bantuan Pendidikan Anak Pedalaman Kalimantan",
        amount: "Rp 502.500",
        showBukti: true,
    },
    {
        image: "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=200&q=80",
        category: "Infrastruktur",
        categoryColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        date: "25 Mar 2026",
        title: "Air Bersih untuk Desa Terpencil NTT",
        amount: "Rp 502.500",
        showBukti: false,
    },
];

const UserProfilePage = () => {
    // State untuk mengatur tab yang aktif
    const [activeTab, setActiveTab] = useState('riwayat');

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2ea391] transition-colors font-medium mb-4">
                        <ArrowLeft size={18} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-[#60C9B3] to-[#2ea391]"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-12 mb-4 inline-block">
                                    <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-[#2ea391] p-1.5 rounded-full border-2 border-white shadow-sm">
                                        <CheckCircle2 size={14} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Ahmad Santoso</h2>
                                <p className="text-sm font-medium text-[#2ea391] mb-4">Donatur Terverifikasi</p>
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={16} /> <span>ahmad.santoso@gmail.com</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={16} /> <span>0812-3456-7890</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><MapPin size={16} /> <span>Jakarta Selatan, Indonesia</span></div>
                                </div>
                            </div>
                        </div>

                        {/* NAV MENU */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
                            <nav className="space-y-1">
                                <button onClick={() => setActiveTab('riwayat')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'riwayat' ? 'bg-slate-50 text-[#2ea391] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><History size={20} /><span>Riwayat Donasi</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={() => setActiveTab('sertifikat')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'sertifikat' ? 'bg-slate-50 text-[#2ea391] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><Award size={20} /><span>Sertifikat Saya</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={() => setActiveTab('dampak')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'dampak' ? 'bg-slate-50 text-[#2ea391] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><HandHeart size={20} /><span>Dampak Sosial</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <div className="my-2 border-t border-slate-50"></div>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 group">
                                    <div className="flex items-center gap-3"><Settings size={20} /><span>Pengaturan Akun</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                                    <div className="flex items-center gap-3"><LogOut size={20} /><span className="font-medium">Keluar</span></div>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={<CreditCard size={20} />} label="Total Donasi" value="Rp 1.750k" colorClass="bg-emerald-50 text-emerald-600" />
                            <StatCard icon={<Calendar size={20} />} label="Bergabung" value="Jan 2026" colorClass="bg-blue-50 text-blue-600" />
                            <StatCard icon={<HandHeart size={20} />} label="Dampak" value="8 Orang" colorClass="bg-orange-50 text-orange-600" />
                        </div>

                        {/* TAB RIWAYAT */}
                        {activeTab === 'riwayat' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900">Riwayat Donasi</h2>
                                    <button className="text-sm font-bold text-[#2ea391] hover:underline">Lihat Semua</button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {donationData.map((item, index) => (
                                        <DonationHistoryItem key={index} {...item} />
                                    ))}
                                </div>
                            </div>
                        )}

                       {/* TAB SERTIFIKAT */}
{activeTab === 'sertifikat' && (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
        {/* HEADER TAB SERTIFIKAT */}
        <div className="mb-8">
            <h2 className="text-[2.5rem] font-extrabold text-slate-900 leading-tight mb-3">
                Sertifikat Donasi Anda
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                Apresiasi atas kontribusi Anda dalam menciptakan perubahan nyata. Simpan dan bagikan sertifikat kebaikan Anda.
            </p>
        </div>
        
        {/* GRID SERTIFIKAT */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {certificateData.map((cert) => (
        <div key={cert.id} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col hover:shadow-lg transition-all duration-300">
            {/* Gambar Sertifikat */}
            <div className="aspect-[1.5/1] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover" 
                />
            </div>

            {/* Info */}
            <div className="mb-8">
                <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 line-clamp-2">
                    {cert.title}
                </h3>
                <p className="text-[#28a792] font-black text-xl">
                    {cert.amount}
                </p>
            </div>

            {/* Tombol Action */}
            <div className="flex items-center gap-2 mt-auto">
                {/* Tombol Download */}
                <button className="flex-grow flex items-center justify-center gap-2 bg-[#28a792] text-white py-3 px-4 rounded-xl font-bold text-[13px] hover:bg-[#218d7c] transition-all shadow-md shadow-teal-900/5 active:scale-95">
        <Download size={16} strokeWidth={2.5} />
        Download Sertifikat
    </button>
                
                {/* Tombol Share: Kotak Kecil */}
                <button className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 border border-slate-100 transition-all active:scale-95">
        <Share2 size={16} />
    </button>
            </div>
        </div>
    ))}
</div>

        {/* IMPACT MILESTONE */}
        <div className="bg-[#B2F5EA] rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-teal-50 shadow-sm mt-12">
            <div className="flex-1 relative z-10 text-center md:text-left md:pr-10">
                <span className="bg-[#1D4E44] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
                    Impact Milestone
                </span>
                <h2 className="text-[#0F2F29] text-4xl lg:text-5xl font-[900] mb-5 leading-[1.1] tracking-tight">
                    Anda Telah Membantu<br />120+ Keluarga
                </h2>
                <p className="text-[#2D5A51] text-base md:text-lg mb-8 max-w-[400px] leading-relaxed opacity-90">
                    Kumpulan sertifikat ini adalah bukti nyata perjalanan kedermawanan Anda. Teruslah menjadi bagian dari solusi global.
                </p>
                <button className="bg-[#1D4E44] text-white px-8 py-4 rounded-2xl font-extrabold text-base hover:bg-[#153a32] transition-all shadow-xl shadow-teal-900/20 active:scale-95">
                    Lihat Laporan Dampak
                </button>
            </div>

            <div className="relative mt-12 md:mt-0">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-[3.5rem] overflow-hidden bg-[#0A1A17] p-2 relative shadow-2xl border-4 border-white/30 transform md:rotate-3 transition-transform hover:rotate-0 duration-500">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                        alt="User Portrait" 
                        className="w-full h-full object-contain bg-[#1d4e44]"
                    />
                </div>
                <div className="absolute -inset-4 bg-white/20 blur-3xl rounded-full -z-10"></div>
            </div>
        </div>
    </div>
)}

                        {activeTab === 'dampak' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
    
    <div className="bg-[#28a792] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-lg">
      <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
        
        <div className="flex-1 space-y-4">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Laporan Dampak 2026
          </span>
          <h2 className="text-5xl font-black leading-tight">
            Dampak <br /> Kebaikan Anda
          </h2>
          <p className="text-white/80 text-base max-w-sm">
            Kontribusi Anda telah mengubah wajah masa depan bagi mereka yang membutuhkan.
          </p>
        </div>

        {/* Sisi Kanan */}
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 h-32 flex flex-col justify-center">
            <h4 className="text-xl font-black">1.750.000</h4>
            <p className="text-[10px] uppercase font-bold opacity-60">Total Rupiah Donasi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 h-32 flex flex-col justify-center">
            <h4 className="text-xl font-black">~150</h4>
            <p className="text-[10px] uppercase font-bold opacity-60">Orang Terbantu</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 col-span-2 flex justify-between items-center h-24">
            <div>
              <h4 className="text-3xl font-black">3</h4>
              <p className="text-[10px] uppercase font-bold opacity-60">Program Didukung</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#28a792] flex items-center justify-center">🎓</div>
              <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#28a792] flex items-center justify-center">🏥</div>
              <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#28a792] flex items-center justify-center">🌿</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* SECTION BAWAH */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative">
        <div className="absolute top-0 right-8 text-[120px] font-black text-slate-50 leading-none select-none">99</div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-[#28a792]"></div>
            <span className="text-[10px] font-bold text-[#28a792] uppercase">A Message of Gratitude</span>
          </div>
          <h3 className="text-3xl font-bold">Terima Kasih, Ahmad!</h3>
          <p className="text-slate-500 italic text-lg leading-relaxed">
            "Dukungan Anda telah memungkinkan 15 anak mendapatkan beasiswa penuh tahun ini."
          </p>
          <p className="font-bold text-slate-800">— Direktur Program Care Fund</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center space-y-4">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#28a792] shadow-sm">
          <Heart size={28} fill="currentColor" />
        </div>
        <h3 className="font-bold text-lg">Siap Melanjutkan Perjalanan Ini?</h3>
        <button className="w-full bg-[#28a792] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#218d7c] transition-all">
          Donasi Lagi
        </button>
      </div>
    </div>
  </div>
)}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserProfilePage;