import MainLayout from "../layouts/mainLayout";
import {
    ArrowLeft, Mail, Phone, MapPin, History, Award,
    HandHeart, Calendar, CheckCircle2, ChevronRight,
    Settings, CreditCard, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const UserProfilePage = () => {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
                {/* Back Button & Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2ea391] transition-colors font-medium mb-4"
                    >
                        <ArrowLeft size={18} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDEBAR - Profil Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-[#60C9B3] to-[#2ea391]"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-12 mb-4">
                                    <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white">
                                        <img
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-20 bg-[#2ea391] p-1.5 rounded-full border-2 border-white shadow-sm">
                                        <CheckCircle2 size={14} className="text-white" />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">Ahmad Santoso</h2>
                                <p className="text-sm font-medium text-[#2ea391] mb-4">Donatur Terverifikasi</p>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Mail size={16} className="text-slate-400" />
                                        <span>ahmad.santoso@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Phone size={16} className="text-slate-400" />
                                        <span>0812-3456-7890</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>Jakarta Selatan, Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
                            <nav className="space-y-1">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 text-[#2ea391] font-bold transition-all">
                                    <div className="flex items-center gap-3">
                                        <History size={20} />
                                        <span>Riwayat Donasi</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>

                                {/* Opsi 2: Sertifikat Saya */}
                                <Link to="/certificate" className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Award size={20} className="text-slate-400 group-hover:text-[#2ea391]" />
                                        <span>Sertifikat Saya</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </Link>

                                {/* Opsi 3: Dampak Sosial */}
                                <Link to="/impact" className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <HandHeart size={20} className="text-slate-400 group-hover:text-[#2ea391]" />
                                        <span>Dampak Sosial</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </Link>

                                <div className="my-2 border-t border-slate-50"></div>

                                <button className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Settings size={20} className="text-slate-400 group-hover:text-slate-900" />
                                        <span>Pengaturan Akun</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <LogOut size={20} />
                                        <span className="font-medium">Keluar</span>
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* RIGHT CONTENT - Statistics & History */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard 
                                icon={CreditCard} 
                                label="Total Donasi" 
                                value="Rp 1.750k" 
                                subValue="3 Program didukung" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <StatCard 
                                icon={Calendar} 
                                label="Bergabung" 
                                value="Jan 2026" 
                                subValue="4 bulan berkontribusi" 
                                colorClass="bg-blue-50 text-blue-600" 
                            />
                            <StatCard 
                                icon={HandHeart} 
                                label="Dampak" 
                                value="8 Orang" 
                                subValue="Penerima manfaat" 
                                colorClass="bg-orange-50 text-orange-600" 
                            />
                        </div>

                        {/* Donation History List */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">Riwayat Donasi</h2>
                                <button className="text-sm font-bold text-[#2ea391] hover:underline">Lihat Semua</button>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {/* Item Donasi 1 */}
                                <div className="p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        <img
                                            className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                                            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80"
                                            alt="pendidikan"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Pendidikan</span>
                                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                    <Calendar size={12} />
                                                    <span>28 Mar 2026</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={10} />
                                                    <span>BERHASIL</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1 leading-tight">Bantuan Pendidikan Anak Pedalaman Kalimantan</h3>
                                            <div className="flex justify-between items-end mt-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Dibayar</p>
                                                    <p className="text-lg font-black text-slate-900">Rp 502.500</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                                        Bukti
                                                    </button>
                                                    <button className="px-4 py-2 text-xs font-bold text-white bg-[#2ea391] rounded-xl hover:shadow-lg hover:shadow-[#2ea391]/20 transition-all">
                                                        Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Item Donasi 2 */}
                                <div className="p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        <img
                                            className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                                            src="https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=200&q=80"
                                            alt="infrastruktur"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Infrastruktur</span>
                                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                    <Calendar size={12} />
                                                    <span>25 Mar 2026</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={10} />
                                                    <span>BERHASIL</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1 leading-tight">Air Bersih untuk Desa Terpencil NTT</h3>
                                            <div className="flex justify-between items-end mt-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Dibayar</p>
                                                    <p className="text-lg font-black text-slate-900">Rp 502.500</p>
                                                </div>
                                                <button className="px-4 py-2 text-xs font-bold text-white bg-[#2ea391] rounded-xl hover:shadow-lg hover:shadow-[#2ea391]/20 transition-all">
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

const StatCard = ({ icon: Icon, label, value, subValue, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
        <div className={`${colorClass} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
            <Icon size={20} />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">{subValue}</p>
    </div>
);

export default UserProfilePage;
