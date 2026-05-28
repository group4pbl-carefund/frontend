import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, UserCircle2, MapPin, CalendarDays, Target, Users, ShieldCheck, HeartHandshake, CreditCard, Smartphone, QrCode } from 'lucide-react';
import { formatRupiahFull, formatDate } from '../utils/format';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const DonationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('deskripsi');
    const [selectedAmount, setSelectedAmount] = useState('100000');
    const [selectedMethod, setSelectedMethod] = useState('Transfer Bank');
    const [comment, setComment] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        const fetchDetailPageData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/program-campaigns/${id}`);
                const dataUtama = res.data?.data || res.data;
                setCampaign(dataUtama);

                try {
                    const donorRes = await api.get(`/program-campaigns/${id}/donors`);
                    const dataDonatur = donorRes.data?.data || donorRes.data;
                    setDonors(Array.isArray(dataDonatur) ? dataDonatur : []);
                } catch (e) {
                    setDonors([]);
                }
            } catch (err) {
                console.error("Gagal memuat API Utama:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetailPageData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F7F6] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#147D73]"></div>
            </div>
        );
    }

    const displayCampaign = campaign || {};
    const displayTitle = displayCampaign.program?.program_name || displayCampaign.title || '';
    const displayTarget = displayCampaign.program?.target_amount || displayCampaign.target_amount || 0;
    const displayCurrent = displayCampaign.current_amount || displayCampaign.current_amount || 0;
    const displayStory = displayCampaign.program?.description || displayCampaign.story || '';
    const displayCategory = displayCampaign.program?.category || 'Umum';
    const displayImage = displayCampaign.program?.image_url || displayCampaign.image_url || '';
    
    // Calculate days left
    let displayDaysLeft = 0;
    let endDateStr = 'Tidak Terbatas';
    if (displayCampaign.program?.end_date) {
        const endDate = new Date(displayCampaign.program.end_date);
        endDateStr = formatDate(displayCampaign.program.end_date, 'dayMonth');
        displayDaysLeft = Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)));
    }

    const currentAmount = Number(displayCurrent) || 0;
    const targetAmount = Number(displayTarget) || 1;
    const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
    
    const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

    const handleCheckout = () => {
        navigate(`/donasi/${id}/checkout`, {
            state: {
                amount: selectedAmount,
                paymentMethod: selectedMethod,
                comment: comment,
                anonymous: anonymous
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F4F7F6] text-slate-900 pb-20">
            {/* Header */}
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 pt-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 p-2 rounded-full hover:bg-slate-200 transition-colors inline-flex"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-800" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* KOLOM KIRI (KONTEN) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Gambar & Kategori */}
                        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-slate-200">
                            {displayImage ? (
                                <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-300"></div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg">
                                <span className="text-[10px] font-black text-[#147D73] uppercase tracking-wider">{displayCategory}</span>
                            </div>
                        </div>

                        {/* Judul & Penyelenggara */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                                {displayTitle}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                    <ShieldCheck className="w-6 h-6 text-[#147D73]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">
                                        {displayCampaign.program?.user?.full_name || displayCampaign.organizer_name || 'Yayasan Cahaya Pendidikan'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Terverifikasi • Bergabung sejak {displayCampaign.program?.user?.created_at ? new Date(displayCampaign.program.user.created_at).getFullYear() : 2024}</p>
                                </div>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-8 border-b border-slate-200">
                            {['deskripsi', 'update', 'donatur'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-bold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-[#147D73] text-[#147D73]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* TAB KONTEN */}
                        <div className="min-h-[300px]">
                            
                            {activeTab === 'deskripsi' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-4">Tentang Program</h2>
                                        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line">
                                            {displayStory}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-[#EAF3F2] p-4 rounded-2xl">
                                            <Target className="w-5 h-5 text-[#147D73] mb-3" />
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Target Dana</p>
                                            <p className="font-bold text-slate-900 text-sm mt-1">{formatRupiahFull(targetAmount)}</p>
                                        </div>
                                        <div className="bg-[#EAF3F2] p-4 rounded-2xl">
                                            <Users className="w-5 h-5 text-[#147D73] mb-3" />
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Penerima Manfaat</p>
                                            <p className="font-bold text-slate-900 text-sm mt-1">
                                                {displayCampaign.program?.beneficiary_type === 'diri_sendiri' ? 'Diri Sendiri' : 
                                                 displayCampaign.program?.beneficiary_type === 'keluarga' ? 'Keluarga' : 'Banyak Orang'}
                                            </p>
                                        </div>
                                        <div className="bg-[#EAF3F2] p-4 rounded-2xl">
                                            <MapPin className="w-5 h-5 text-[#147D73] mb-3" />
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Lokasi</p>
                                            <p className="font-bold text-slate-900 text-sm mt-1">Indonesia</p>
                                        </div>
                                        <div className="bg-[#EAF3F2] p-4 rounded-2xl">
                                            <CalendarDays className="w-5 h-5 text-[#147D73] mb-3" />
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Berakhir</p>
                                            <p className="font-bold text-slate-900 text-sm mt-1">{endDateStr}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'update' && (
                                <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-slate-500 font-medium">Belum ada update terbaru untuk kampanye ini.</p>
                                </div>
                            )}

                            {activeTab === 'donatur' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {donors.length === 0 ? (
                                        <p className="text-slate-500 font-medium text-center py-10">Belum ada donatur. Jadilah yang pertama!</p>
                                    ) : (
                                        donors.map((donor, idx) => (
                                            <div key={idx} className="bg-white p-5 rounded-2xl flex items-center justify-between border border-white shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#EAF3F2] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <UserCircle2 className="w-6 h-6 text-[#147D73]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{donor.name || 'Orang Baik'}</p>
                                                        {donor.comment && (
                                                            <p className="text-xs text-slate-500 italic mt-0.5">"{donor.comment}"</p>
                                                        )}
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Baru saja</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-[#147D73] text-sm">{formatRupiahFull(donor.amount)}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* KOLOM KANAN (STICKY SIDEBAR) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm sticky top-24 border border-white">
                            <h2 className="text-lg font-extrabold text-slate-900 mb-6">Berdonasi Sekarang</h2>
                            
                            {/* Progress Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-3xl font-black text-[#147D73]">{formatRupiahFull(currentAmount)}</p>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-slate-900 leading-none">{percentage}%</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Tercapai</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mb-3 font-medium">Terkumpul dari {formatRupiahFull(targetAmount)}</p>
                                
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#147D73] rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
                                </div>
                                
                                <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-slate-700">
                                    <HeartHandshake className="w-4 h-4 text-[#147D73]" />
                                    <span>{donors.length}</span> orang telah berdonasi
                                </div>
                            </div>

                            {/* Nominal Section */}
                            <div className="mb-6 space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jumlah Donasi</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="font-bold text-[#147D73]">Rp</span>
                                    </div>
                                    <input 
                                        type="number"
                                        value={selectedAmount}
                                        onChange={(e) => setSelectedAmount(e.target.value)}
                                        className="w-full bg-[#F4F7F6] text-slate-900 font-black py-4 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-[#147D73]/20 transition-all text-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.slice(0, 3).map(amt => (
                                        <button 
                                            key={amt}
                                            onClick={() => setSelectedAmount(amt.toString())}
                                            className="py-2.5 bg-white border border-slate-200 hover:border-[#147D73] rounded-xl text-[11px] font-bold text-slate-700 transition-colors"
                                        >
                                            {amt.toLocaleString('id-ID')}
                                        </button>
                                    ))}
                                    {quickAmounts.slice(3, 5).map(amt => (
                                        <button 
                                            key={amt}
                                            onClick={() => setSelectedAmount(amt.toString())}
                                            className="py-2.5 bg-white border border-slate-200 hover:border-[#147D73] rounded-xl text-[11px] font-bold text-slate-700 transition-colors"
                                        >
                                            {amt.toLocaleString('id-ID')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="mb-8 space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metode Pembayaran</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'Transfer Bank', label: 'Transfer Bank', badge: 'Bank', icon: <CreditCard className="w-4 h-4 text-slate-400" /> },
                                        { id: 'Transfer QRIS', label: 'Transfer QRIS', badge: 'QRIS', icon: <QrCode className="w-4 h-4 text-slate-400" /> }
                                    ].map(method => (
                                        <label key={method.id} className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-colors ${selectedMethod === method.id ? 'border-[#147D73] bg-[#F4F7F6]' : 'border-slate-100 hover:bg-slate-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value={method.id}
                                                    checked={selectedMethod === method.id}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="w-4 h-4 text-[#147D73] accent-[#147D73] focus:ring-[#147D73] border-slate-300"
                                                />
                                                <span className="text-xs font-bold text-slate-700">{method.label}</span>
                                            </div>
                                            <div className="bg-[#EAF3F2] px-2 py-0.5 rounded text-[9px] font-extrabold text-[#147D73] uppercase tracking-wider">
                                                {method.badge}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Comment and Anonymous Section */}
                            <div className="mb-8 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pesan atau Doa (Opsional)</label>
                                    <textarea 
                                        rows="2"
                                        placeholder="Tulis dukungan Anda..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-[#F4F7F6] border border-transparent rounded-xl p-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 transition-all resize-none"
                                    />
                                </div>
                                <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div className="pr-2">
                                        <p className="text-xs font-bold text-slate-700">Sembunyikan nama saya</p>
                                        <p className="text-[9px] text-slate-500 mt-0.5">Tampil sebagai "Orang Baik"</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        className="w-4 h-4 text-[#147D73] accent-[#147D73] rounded border-slate-300 focus:ring-[#147D73]"
                                    />
                                </label>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-teal-900/20 mb-6"
                            >
                                Lanjut Pembayaran
                            </button>

                            <div className="text-center">
                                <div className="inline-flex items-center gap-1.5 text-slate-700 mb-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Keamanan Terjamin</span>
                                </div>
                                <p className="text-[9px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                                    Donasi akan dikelola transparan. Potongan operasional 5% untuk keberlangsungan sistem.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
            
            <Footer />

        </div>
    );
};

export default DonationDetailPage;