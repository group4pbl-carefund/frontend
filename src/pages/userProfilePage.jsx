import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/mainLayout";
import {
    ArrowLeft, Mail, Phone, MapPin, History, Award,
    HandHeart, Calendar, CheckCircle2, ChevronRight,
    Settings, CreditCard, LogOut, Download, Share2, Heart, PlusCircle, Megaphone,
    Users, Plus, MessageSquare, Camera, GraduationCap, Hospital, Leaf
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StatCard from "../components/statCard";
import DonationHistoryItem from "../components/donationHistoryItem";
import api from "../utils/api";
import { formatRupiahFull, formatDate } from "../utils/format";

const UserProfilePage = () => {
    const navigate = useNavigate();
    // State untuk mengatur tab yang aktif
    const [activeTab, setActiveTab] = useState('riwayat');

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [isUploading, setIsUploading] = useState(false);

    // State untuk integrasi backend
    const [userDonations, setUserDonations] = useState([]);
    const [stats, setStats] = useState({
        totalDonasi: 0,
        bergabung: '',
        dampakOrang: 0,
        programDidukung: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                // Fetch the latest user profile to ensure status changes (e.g. KYC) are reflected
                const meRes = await api.get('/me');
                const latestUser = meRes.data?.data || meRes.data;
                if (latestUser) {
                    setUser(latestUser);
                    localStorage.setItem('user', JSON.stringify(latestUser));
                }

                // Set 'bergabung' dari data user
                const joinDate = latestUser?.created_at ? new Date(latestUser.created_at) : new Date();
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                const bergabungFormatted = `${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;

                // Fetch all donations (fallback if specific user endpoint isn't available)
                const res = await api.get('/donations');
                const allDonations = res.data?.data || [];

                // Filter donations for this user
                const myDonations = allDonations.filter(d => d.user_id === user.id);

                // Sort by latest
                myDonations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setUserDonations(myDonations);

                // Calculate stats
                let totalDonasi = 0;
                const uniquePrograms = new Set();

                myDonations.forEach(d => {
                    // Cek status pembayaran untuk menghitung total donasi sukses
                    const statusLower = d.payment_status?.toLowerCase();
                    if (statusLower === 'success' || statusLower === 'paid' || statusLower === 'settlement' || statusLower === 'completed') {
                        totalDonasi += parseFloat(d.amount || 0);
                        if (d.program_campaign_id) {
                            uniquePrograms.add(d.program_campaign_id);
                        }
                    }
                });

                // Asumsi sederhana: 1 donasi bisa berdampak ke ~5 orang
                const dampakOrang = uniquePrograms.size * 10 + Math.floor(totalDonasi / 100000);

                setStats({
                    totalDonasi,
                    bergabung: bergabungFormatted,
                    dampakOrang,
                    programDidukung: uniquePrograms.size
                });

            } catch (err) {
                console.error("Gagal memuat data donasi pengguna:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);





    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api.defaults.baseURL}/profile/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal mengunggah foto');
            }
            
            const updatedUser = responseData.data || responseData;
            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Foto profil Anda berhasil diperbarui.',
                    icon: 'success',
                    confirmButtonColor: '#147D73'
                });
            }
        } catch (error) {
            const backendMessage = error.message || 'Terjadi kesalahan saat mengunggah foto. Pastikan ukuran file tidak terlalu besar.';
            Swal.fire({
                title: 'Gagal!',
                text: backendMessage,
                icon: 'error',
                confirmButtonColor: '#147D73'
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



    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#147D73] transition-colors font-medium mb-4 text-left">
                        <ArrowLeft size={18} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 text-left">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
                            <div className="h-24 bg-linear-to-r from-[#147D73] to-[#147D73]"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-12 mb-4 inline-block group cursor-pointer" onClick={() => !isUploading && document.getElementById('avatarUpload').click()}>
                                    <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white relative">
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                                                <span className="block w-6 h-6 border-4 border-[#147D73] border-t-transparent rounded-full animate-spin"></span>
                                            </div>
                                        )}
                                        <img src={user?.avatar_url ? `${api.defaults.baseURL.replace('/api', '')}${user.avatar_url}` : ''} alt="Profile" className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <Camera className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    {user?.is_verified ? (
                                        <div className="absolute bottom-0 right-0 bg-[#147D73] p-1.5 rounded-full border-2 border-white shadow-sm">
                                            <CheckCircle2 size={14} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-0 right-0 bg-amber-500 p-1.5 rounded-full border-2 border-white shadow-sm">
                                            <span className="block w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{user?.full_name || ''}</h2>
                                <p className={`text-sm font-medium mb-4 ${user?.is_verified ? 'text-[#147D73]' : 'text-amber-500'}`}>
                                    {user?.is_verified ? 'Donatur Terverifikasi' : 'Menunggu Verifikasi KYC'}
                                </p>
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={16} /> <span className="truncate">{user?.email || ''}</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={16} /> <span>{user?.phone || ''}</span></div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm"><MapPin size={16} /> <span className="truncate">{user?.city ? `${user.city}, ${user.country || 'Indonesia'}` : ''}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* NEW CAMPAIGN BUTTON */}
                        <Link to="/buat-kampanye" className="block w-full">
                            <div className="bg-linear-to-r from-[#147D73] to-[#147D73] rounded-3xl p-5 text-white shadow-md shadow-teal-900/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
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
                                <button onClick={() => setActiveTab('riwayat')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'riwayat' ? 'bg-slate-50 text-[#147D73] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><History size={20} /><span>Riwayat Donasi</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={() => setActiveTab('sertifikat')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'sertifikat' ? 'bg-slate-50 text-[#147D73] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><Award size={20} /><span>Sertifikat Saya</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={() => setActiveTab('dampak')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'dampak' ? 'bg-slate-50 text-[#147D73] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><HandHeart size={20} /><span>Dampak Sosial</span></div>
                                    <ChevronRight size={16} />
                                </button>
                                <div className="my-2 border-t border-slate-50"></div>
                                <button onClick={() => navigate('/manage-campaign')} className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 group transition-all">
                                    <div className="flex items-center gap-3"><Megaphone size={20} /><span>Kelola Kampanye Saya</span></div>
                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
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
                            <StatCard icon={<CreditCard size={20} />} label="Total Donasi" value={formatRupiahFull(stats.totalDonasi)} colorClass="bg-emerald-50 text-emerald-600" />
                            <StatCard icon={<Calendar size={20} />} label="Bergabung" value={stats.bergabung} colorClass="bg-teal-50 text-teal-600" />
                            <StatCard icon={<HandHeart size={20} />} label="Dampak" value={`${stats.dampakOrang} Orang`} colorClass="bg-orange-50 text-orange-600" />
                        </div>

                        {/* TAB RIWAYAT */}
                        {activeTab === 'riwayat' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500 text-left">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900">Riwayat Donasi</h2>
                                    <button className="text-sm font-bold text-[#147D73] hover:underline">Lihat Semua</button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        <div className="p-8 text-center text-slate-500">Memuat riwayat...</div>
                                    ) : userDonations.length > 0 ? (
                                        userDonations.map((d, index) => {
                                            const statusLower = d.payment_status?.toLowerCase();
                                            const isSuccess = ['success', 'paid', 'settlement', 'completed'].includes(statusLower);
                                            return (
                                                <DonationHistoryItem
                                                    key={d.id || index}
                                                    image={d.program?.image_url || ''}
                                                    category={d.program?.category || ''}
                                                    categoryColor={isSuccess ? "text-emerald-600" : "text-amber-600"}
                                                    bgColor={isSuccess ? "bg-emerald-50" : "bg-amber-50"}
                                                    date={formatDate(d.created_at, 'short')}
                                                    title={d.program?.title || d.program?.program_name || ''}
                                                    amount={formatRupiahFull(d.amount)}
                                                    showBukti={isSuccess}
                                                />
                                            );
                                        })
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">Belum ada riwayat donasi.</div>
                                    )}
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
                                    {isLoading ? (
                                        <div className="col-span-full py-8 text-center text-slate-500">Memuat sertifikat...</div>
                                    ) : userDonations.filter(d => ['success', 'paid', 'settlement', 'completed'].includes(d.payment_status?.toLowerCase())).length > 0 ? (
                                        userDonations
                                            .filter(d => ['success', 'paid', 'settlement', 'completed'].includes(d.payment_status?.toLowerCase()))
                                            .map((cert) => (
                                                <div key={cert.id} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col hover:shadow-lg transition-all duration-300">
                                                    {/* Gambar Sertifikat */}
                                                    <div className="aspect-[1.5/1] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                                                        <img
                                                            src={cert.program?.image_url || ''}
                                                            alt={cert.program?.title || ''}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="mb-8">
                                                        <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 line-clamp-2">
                                                            {cert.program?.title || cert.program?.program_name || ''}
                                                        </h3>
                                                        <p className="text-[#147D73] font-black text-xl">
                                                            {formatRupiahFull(cert.amount)}
                                                        </p>
                                                    </div>

                                                    {/* Tombol Action */}
                                                    <div className="flex items-center gap-2 mt-auto">
                                                        <button className="flex-grow flex items-center justify-center gap-2 bg-[#147D73] text-white py-3 px-4 rounded-xl font-bold text-[13px] hover:bg-[#0F655C] transition-all shadow-md shadow-teal-900/5 active:scale-95">
                                                            <Download size={16} strokeWidth={2.5} />
                                                            Download Sertifikat
                                                        </button>

                                                        <button className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 border border-slate-100 transition-all active:scale-95">
                                                            <Share2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="col-span-full py-8 text-center text-slate-500">Belum ada sertifikat donasi.</div>
                                    )}
                                </div>

                                {/* IMPACT MILESTONE */}
                                <div className="bg-[#E8F3F1] rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-teal-50 shadow-sm mt-12">
                                    <div className="flex-1 relative z-10 text-center md:text-left md:pr-10">
                                        <span className="bg-[#1D4E44] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
                                            Impact Milestone
                                        </span>
                                        <h2 className="text-[#0F2F29] text-4xl lg:text-5xl font-[900] mb-5 leading-[1.1] tracking-tight">
                                            Anda Telah Membantu<br />{stats.dampakOrang}+ Keluarga
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
                                                src={user?.avatar_url ? `${api.defaults.baseURL.replace('/api', '')}${user.avatar_url}` : ''}
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
                                <div className="bg-[#147D73] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-lg">
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
                                                <h4 className="text-xl font-black">{formatRupiahFull(stats.totalDonasi)}</h4>
                                                <p className="text-[10px] uppercase font-bold opacity-60">Total Rupiah Donasi</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 h-32 flex flex-col justify-center">
                                                <h4 className="text-xl font-black">~{stats.dampakOrang}</h4>
                                                <p className="text-[10px] uppercase font-bold opacity-60">Orang Terbantu</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 col-span-2 flex justify-between items-center h-24">
                                                <div>
                                                    <h4 className="text-3xl font-black">{stats.programDidukung}</h4>
                                                    <p className="text-[10px] uppercase font-bold opacity-60">Program Didukung</p>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#147D73] flex items-center justify-center">
                                                        <GraduationCap size={18} className="text-white" />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#147D73] flex items-center justify-center">
                                                        <Hospital size={18} className="text-white" />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-[#1D4E44] border-2 border-[#147D73] flex items-center justify-center">
                                                        <Leaf size={18} className="text-white" />
                                                    </div>
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
                                                <div className="w-8 h-[2px] bg-[#147D73]"></div>
                                                <span className="text-[10px] font-bold text-[#147D73] uppercase">A Message of Gratitude</span>
                                            </div>
                                            <h3 className="text-3xl font-bold">Terima Kasih, {user?.full_name ? user.full_name.split(' ')[0] : ''}!</h3>
                                            <p className="text-slate-500 italic text-lg leading-relaxed">
                                                "Dukungan Anda telah memungkinkan lebih banyak orang mendapatkan bantuan tahun ini."
                                            </p>
                                            <p className="font-bold text-slate-800">— Direktur Program Care Fund</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center space-y-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#147D73] shadow-sm">
                                            <Heart size={28} fill="currentColor" />
                                        </div>
                                        <h3 className="font-bold text-lg">Siap Melanjutkan Perjalanan Ini?</h3>
                                        <button className="w-full bg-[#147D73] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#0F655C] transition-all">
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