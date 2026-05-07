import MainLayout from "../layouts/mainLayout";
import {
    ArrowLeft, Mail, Phone, MapPin, History, Award,
    HandHeart, Calendar, CheckCircle2, ChevronRight,
    Settings, CreditCard, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/statCard";
import DonationHistoryItem from "../components/donationHistoryItem";

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
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
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

                    <div className="lg:col-span-4 space-y-6">
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

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
                            <nav className="space-y-1">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 text-[#2ea391] font-bold transition-all">
                                    <div className="flex items-center gap-3">
                                        <History size={20} />
                                        <span>Riwayat Donasi</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>

                                <Link to="/certificate" className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Award size={20} className="text-slate-400 group-hover:text-[#2ea391]" />
                                        <span>Sertifikat Saya</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </Link>

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

                    <div className="lg:col-span-8 space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard 
                                icon={<CreditCard size={20} />} 
                                label="Total Donasi" 
                                value="Rp 1.750k" 
                                subValue="3 Program didukung" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <StatCard 
                                icon={<Calendar size={20} />} 
                                label="Bergabung" 
                                value="Jan 2026" 
                                subValue="4 bulan berkontribusi" 
                                colorClass="bg-blue-50 text-blue-600" 
                            />
                            <StatCard 
                                icon={<HandHeart size={20} />} 
                                label="Dampak" 
                                value="8 Orang" 
                                subValue="Penerima manfaat" 
                                colorClass="bg-orange-50 text-orange-600" 
                            />
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">Riwayat Donasi</h2>
                                <button className="text-sm font-bold text-[#2ea391] hover:underline">Lihat Semua</button>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {donationData.map((item, index) => (
                                  <DonationHistoryItem
                                    key={index}
                                    image={item.image}
                                    category={item.category}
                                    categoryColor={item.categoryColor}
                                    bgColor={item.bgColor}
                                    date={item.date}
                                    title={item.title}
                                    amount={item.amount}
                                    showBukti={item.showBukti}
                                  />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserProfilePage;
