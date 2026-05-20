import React, { useState } from "react";
import MainLayout from "../layouts/mainLayout";
import {
    ArrowLeft, Mail, Phone, MapPin, History, Award,
    HandHeart, Calendar, CheckCircle2, ChevronRight,
    Settings, CreditCard, LogOut, Download, Share2, Heart, PlusCircle, Megaphone,
    Users, Plus, MessageSquare, Camera
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import StatCard from "../components/statCard";
import DonationHistoryItem from "../components/donationHistoryItem";
import { getCampaigns, updateCampaignDays, addCampaignUpdate } from "../utils/campaignDb";
import api from "../utils/api";

const certificateData = [
    {
        id: 1,
        title: "Bantuan Pendidikan Anak Pedalaman Kalimantan",
        amount: "Rp 500.000",
        image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=400"
    },
    {
        id: 2,
        title: "Air Bersih untuk Desa Terpencil NTT",
        amount: "Rp 250.000",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400"
    },
    {
        id: 3,
        title: "Pemulihan Ekonomi Korban Bencana",
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

    // Ambil data user aktif dari localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isUploading, setIsUploading] = useState(false);

    // Campaign Management States
    const [campaigns, setCampaigns] = useState(() => getCampaigns());
    const [activeCampaign, setActiveCampaign] = useState(() => campaigns[0] || null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        // Because backend is expecting a PATCH method but we are sending multipart/form-data
        formData.append('_method', 'PATCH');

        try {
            const response = await api.post(`/users/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const updatedUser = response.data?.data || response.data;
            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Foto profil Anda berhasil diperbarui.',
                    icon: 'success',
                    confirmButtonColor: '#2ea391'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat mengunggah foto. Pastikan ukuran file tidak terlalu besar.',
                icon: 'error',
                confirmButtonColor: '#2ea391'
            });
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleExtendDays = async () => {
        if (!activeCampaign) return;

        const result = await Swal.fire({
            title: 'Perpanjang Durasi',
            text: 'Apakah Anda yakin ingin menambahkan 7 hari ke durasi penggalangan dana?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Perpanjang',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#2ea391',
            cancelButtonColor: '#aaa'
        });

        if (result.isConfirmed) {
            const newDays = activeCampaign.daysLeft + 7;
            updateCampaignDays(activeCampaign.id, newDays);

            // Refresh local state
            setActiveCampaign({
                ...activeCampaign,
                daysLeft: newDays
            });

            Swal.fire({
                title: 'Berhasil!',
                text: `Durasi kampanye berhasil diperpanjang menjadi ${newDays} hari.`,
                icon: 'success',
                confirmButtonColor: '#2ea391'
            });
        }
    };

    const handleCreateUpdate = async () => {
        if (!activeCampaign) return;

        const { value: text } = await Swal.fire({
            title: 'Buat Kabar Terbaru',
            input: 'textarea',
            inputLabel: 'Laporkan perkembangan kondisi penerima manfaat atau transparansi penggunaan dana kepada donatur.',
            inputPlaceholder: 'Tulis laporan kabar terbaru di sini...',
            showCancelButton: true,
            confirmButtonText: 'Terbitkan Laporan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#2ea391',
            cancelButtonColor: '#aaa',
            inputValidator: (value) => {
                if (!value) {
                    return 'Isi laporan tidak boleh kosong!';
                }
            }
        });

        if (text) {
            addCampaignUpdate(activeCampaign.id, text);

            // Ambil data kampanye terbaru dengan updatenya
            const updatedList = getCampaigns();
            const updatedCampaign = updatedList.find(c => c.id === activeCampaign.id);
            setActiveCampaign(updatedCampaign);

            Swal.fire({
                title: 'Berhasil Diterbitkan!',
                text: 'Laporan kabar terbaru Anda telah berhasil dikirimkan ke seluruh donatur kampanye ini.',
                icon: 'success',
                confirmButtonColor: '#2ea391'
            });
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2ea391] transition-colors font-medium mb-4 text-left">
                        <ArrowLeft size={18} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 text-left">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
                            <div className="h-24 bg-linear-to-r from-[#60C9B3] to-[#2ea391]"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-12 mb-4 inline-block group cursor-pointer" onClick={() => !isUploading && document.getElementById('avatarUpload').click()}>
                                    <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white relative">
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                                                <span className="block w-6 h-6 border-4 border-[#2ea391] border-t-transparent rounded-full animate-spin"></span>
                                            </div>
                                        )}
                                        <img src={user?.avatar_url ? `http://127.0.0.1:8000${user.avatar_url}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'Felix'}`} alt="Profile" className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <Camera className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    {user?.is_verified ? (
                                        <div className="absolute bottom-0 right-0 bg-[#2ea391] p-1.5 rounded-full border-2 border-white shadow-sm">
                                            <CheckCircle2 size={14} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-0 right-0 bg-amber-500 p-1.5 rounded-full border-2 border-white shadow-sm">
                                            <span className="block w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{user?.full_name || 'Ahmad Santoso'}</h2>
                                <p className={`text-sm font-medium mb-4 ${user?.is_verified ? 'text-[#2ea391]' : 'text-amber-500'}`}>
                                    {user?.is_verified ? 'Donatur Terverifikasi' : 'Menunggu Verifikasi KYC'}
                                </p>
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={16} /> <span className="truncate">{user?.email || 'ahmad.santoso@gmail.com'}</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={16} /> <span>{user?.phone || '0812-3456-7890'}</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><MapPin size={16} /> <span className="truncate">{user?.city ? `${user.city}, ${user.country || 'Indonesia'}` : 'Jakarta Selatan, Indonesia'}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* NEW CAMPAIGN BUTTON */}
                        <Link to="/buat-kampanye" className="block w-full">
                            <div className="bg-linear-to-r from-[#60C9B3] to-[#2ea391] rounded-3xl p-5 text-white shadow-md shadow-teal-900/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                        <PlusCircle size={24} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-extrabold text-lg leading-tight">Buat Kampanye</h3>
                                        <p className="text-white/80 text-xs font-medium mt-0.5">Mulai galang dana baru</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

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
                                <button onClick={() => setActiveTab('campaign')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'campaign' ? 'bg-slate-50 text-[#2ea391] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><Megaphone size={20} /><span>Kelola Kampanye Saya</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 group">
                                    <div className="flex items-center gap-3"><Settings size={20} /><span>Pengaturan Akun</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                                    <div className="flex items-center gap-3"><LogOut size={20} /><span className="font-medium">Keluar</span></div>
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={<CreditCard size={20} />} label="Total Donasi" value="Rp 1.750k" colorClass="bg-emerald-50 text-emerald-600" />
                            <StatCard icon={<Calendar size={20} />} label="Bergabung" value="Jan 2026" colorClass="bg-teal-50 text-teal-600" />
                            <StatCard icon={<HandHeart size={20} />} label="Dampak" value="8 Orang" colorClass="bg-orange-50 text-orange-600" />
                        </div>

                        {/* TAB RIWAYAT */}
                        {activeTab === 'riwayat' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500 text-left">
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
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 text-left">
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
                                                <button className="flex-grow flex items-center justify-center gap-2 bg-[#28a792] text-white py-3 px-4 rounded-xl font-bold text-[13px] hover:bg-[#218d7c] transition-all shadow-md shadow-teal-900/5 active:scale-95">
                                                    <Download size={16} strokeWidth={2.5} />
                                                    Download Sertifikat
                                                </button>

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

                        {/* TAB DAMPAK */}
                        {activeTab === 'dampak' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 text-left">
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

                        {/* TAB KELOLA KAMPANYE */}
                        {activeTab === 'campaign' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 text-left">
                                {/* HEADER */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kelola Kampanye Saya</h2>
                                        <p className="text-slate-500 mt-1 font-medium text-sm">Pantau perkembangan, anggaran, dan transparansi dana Anda.</p>
                                    </div>
                                    {activeCampaign && (
                                        <button
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Bagikan Kampanye!',
                                                    text: `Link kampanye "${activeCampaign.title}" telah disalin ke clipboard Anda!`,
                                                    icon: 'success',
                                                    confirmButtonColor: '#2ea391'
                                                });
                                            }}
                                            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            <Share2 size={16} /> Bagikan
                                        </button>
                                    )}
                                </div>

                                {!activeCampaign ? (
                                    <div className="border-2 border-dashed border-slate-200 p-12 rounded-[2rem] text-center text-slate-400 font-medium bg-slate-50/50">
                                        <div className="text-5xl mb-4">📢</div>
                                        <p className="font-bold text-slate-500 italic">Tidak ada kampanye aktif untuk dikelola saat ini.</p>
                                        <Link to="/buat-kampanye" className="inline-block mt-4 bg-[#2ea391] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#258778] transition-all shadow-md shadow-teal-500/10">
                                            Buat Kampanye Pertama Anda
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {/* DETAIL RINGKASAN */}
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <span className="text-[10px] font-black bg-[#E8F3F1] text-[#2ea391] px-3 py-1 rounded-full uppercase tracking-widest">
                                                {activeCampaign.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-2">{activeCampaign.title}</h3>
                                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Oleh: {activeCampaign.user}</p>
                                        </div>

                                        {/* STATS GRID */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Total Donatur */}
                                            <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                                                <div className="bg-blue-600/10 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3"><Users size={20} /></div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Donatur</p>
                                                <h2 className="text-2xl font-black text-slate-900 mt-1">{activeCampaign.donorsCount.toLocaleString('id-ID')} <span className="text-xs font-medium">Orang</span></h2>
                                            </div>

                                            {/* Sisa Waktu & Extend */}
                                            <div className="p-6 bg-teal-50/50 rounded-[2rem] border border-teal-100/50">
                                                <div className="bg-[#2ea391]/10 text-[#2ea391] w-10 h-10 rounded-xl flex items-center justify-center mb-3"><Calendar size={20} /></div>
                                                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Sisa Waktu</p>
                                                <div className="flex items-end justify-between">
                                                    <h2 className="text-2xl font-black text-slate-900 mt-1">{activeCampaign.daysLeft} <span className="text-xs font-medium">Hari</span></h2>
                                                    <button onClick={handleExtendDays} className="text-[#2ea391] hover:scale-115 transition-all p-1 bg-white rounded-lg shadow-sm border border-slate-100"><Plus size={16} /></button>
                                                </div>
                                            </div>

                                            {/* Persentase Dana */}
                                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pencapaian Dana</p>
                                                <h2 className="text-3xl font-black text-teal-400 italic">{Math.min(100, Math.round((activeCampaign.collected / activeCampaign.target) * 100))}%</h2>
                                                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-teal-500 h-full" style={{ width: `${Math.min(100, Math.round((activeCampaign.collected / activeCampaign.target) * 100))}%` }}></div>
                                                </div>
                                                <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-wide">
                                                    Rp {activeCampaign.collected.toLocaleString('id-ID')} / Rp {activeCampaign.target.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* UPDATE SECTION */}
                                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">Update Kabar Terbaru</h4>
                                                <p className="text-slate-400 text-xs mt-0.5">Berikan laporan penggunaan dana agar donatur tetap percaya.</p>
                                            </div>
                                            <button
                                                onClick={handleCreateUpdate}
                                                className="bg-[#2ea391] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#258778] transition-all shadow-md shadow-teal-500/10"
                                            >
                                                Buat Laporan
                                            </button>
                                        </div>

                                        {/* DAFTAR LAPORAN YANG SUDAH DITERBITKAN */}
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <MessageSquare size={20} className="text-[#2ea391]" /> Laporan Kabar Terbaru ({activeCampaign.updates?.length || 0})
                                            </h3>
                                            <div className="space-y-4">
                                                {activeCampaign.updates && activeCampaign.updates.length > 0 ? (
                                                    activeCampaign.updates.map((upd) => (
                                                        <div key={upd.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                            <p className="text-[10px] font-bold text-slate-400 mb-1">{upd.date}</p>
                                                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{upd.text}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="border-2 border-dashed border-slate-100 p-6 rounded-2xl text-center text-slate-400 text-sm font-medium italic">
                                                        Belum ada laporan perkembangan yang diterbitkan untuk kampanye ini.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserProfilePage;