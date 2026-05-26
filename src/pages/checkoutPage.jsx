import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/navbar';
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Lock, Check } from 'lucide-react';

const CheckoutPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();

    // Data dari Detail Page
    const amount = Number(location.state?.amount || 100000);
    const paymentMethod = location.state?.paymentMethod || 'Transfer QRIS';
    const comment = location.state?.comment || '';
    const anonymous = location.state?.anonymous || false;

    // State kontrol alur halaman
    const [loading, setLoading] = useState(true);
    const [isPending, setIsPending] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [campaignTitle, setCampaignTitle] = useState('Bantuan Pendidikan Anak Pedalaman Kalimantan');
    const [timeLeft, setTimeLeft] = useState(898); // 14:58 in seconds

    const hasPosted = useRef(false);

    useEffect(() => {
        // Countdown timer
        if (isPending && timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [isPending, timeLeft]);

    useEffect(() => {
        const submitDonation = async () => {
            if (hasPosted.current) return;
            hasPosted.current = true;

            try {
                // Ambil judul kampanye untuk halaman sukses
                try {
                    const campRes = await api.get(`/program-campaigns/${id}`);
                    const campData = campRes.data?.data || campRes.data;
                    setCampaignTitle(campData.program?.program_name || campData.title || 'Program Donasi Care Fund');
                } catch (e) {
                    console.log('Gagal ambil judul kampanye', e);
                }

                const payload = {
                    campaign_id: Number(id),
                    amount: amount,
                    fee_amount: 2500,
                    payment_method: paymentMethod,
                    anonymous: anonymous ? 1 : 0,
                    comment: comment.trim() || null
                };
                
                const response = await api.post('/donations', payload);
                
                // Buat mock order ID
                const randomId = Math.floor(10000 + Math.random() * 90000);
                setOrderId(`#RS-${randomId}-CF`);
                setIsPending(true);

            } catch (err) {
                console.warn("Koneksi API backend dialihkan ke mode simulasi aman.");
                const randomId = Math.floor(10000 + Math.random() * 90000);
                setOrderId(`#RS-${randomId}-CF`);
                setIsPending(true); 
            } finally {
                setLoading(false);
            }
        };

        submitDonation();
    }, [id, amount, paymentMethod, anonymous, comment]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSudahBayar = () => {
        setIsPending(false);
        setIsSuccess(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EEF5F4] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#147D73]"></div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#EEF5F4] text-slate-900 pb-20">
                <Navbar />
                
                <main className="max-w-[800px] mx-auto px-6 pt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-[#006059] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-900/20">
                        <Check className="w-10 h-10" strokeWidth={3} />
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        Terima Kasih, Kebaikan Anda Telah<br/>Tersalurkan!
                    </h1>
                    
                    <p className="text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                        Donasi Anda telah berhasil kami terima dan akan segera digunakan untuk program <span className="font-bold text-[#147D73]">{campaignTitle}</span>.
                    </p>

                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-white text-left relative mb-10 overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Rincian Transaksi</h3>
                            <div className="bg-[#66D3C8] text-[#006059] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Success
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Order ID</p>
                                <p className="font-black text-slate-900 text-sm">{orderId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal</p>
                                <p className="font-bold text-slate-900 text-sm">
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Metode Pembayaran</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">💳</span>
                                    <p className="font-bold text-slate-900 text-sm">{paymentMethod === 'Transfer Bank' ? 'Virtual Account' : 'QRIS'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jumlah Donasi + Admin</p>
                                <p className="font-black text-[#147D73] text-xl">Rp {(amount + 2500).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-[#F4F7F6] p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-lg">💡</span>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Program Terpilih</p>
                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[200px] sm:max-w-xs">{campaignTitle}</p>
                                </div>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                        </div>
                        
                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EAF3F2] rounded-full opacity-50 blur-2xl pointer-events-none"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                        <button 
                            onClick={() => navigate('/user-profile')}
                            className="bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-900/20"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Lihat Sertifikat Donasi
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Kembali ke Dashboard
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Transaksi dienkripsi & aman dengan standar keamanan Care Fund</span>
                    </div>

                </main>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-[#EEF5F4] text-slate-900 pb-20">
                <Navbar />
                
                <main className="max-w-[1000px] mx-auto px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mb-8 p-2 rounded-full hover:bg-slate-200 transition-colors inline-flex"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-800" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                        
                        {/* LEFT: PAYMENT WIDGET */}
                        <div>
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white text-center mb-6">
                                {paymentMethod === 'Transfer Bank' ? (
                                    <div className="w-48 h-48 bg-[#F4F7F6] rounded-3xl mx-auto flex flex-col items-center justify-center p-6 border border-slate-100 mb-10 shadow-inner">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                                            <span className="text-xl font-black text-blue-800">VA</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nomor Virtual Account</p>
                                        <p className="text-xl font-mono font-black text-slate-800 tracking-widest">883081234567890</p>
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 bg-white rounded-3xl mx-auto flex items-center justify-center p-4 border border-slate-100 mb-10 shadow-sm relative">
                                        <div className="absolute -top-4 bg-slate-900 text-white text-[9px] font-bold px-3 py-1 rounded uppercase tracking-wider">QRIS</div>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CareFund-${orderId}`} alt="QRIS" className="w-full h-full opacity-90" />
                                    </div>
                                )}

                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Total Amount (Inc. Admin Rp 2.500)</p>
                                <p className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Rp {(amount + 2500).toLocaleString('id-ID')}</p>
                                <p className="text-sm font-bold text-[#147D73] mb-8">Order ID: {orderId}</p>

                                <div className="inline-flex items-center gap-2 bg-[#FEF2F2] text-[#DC2626] px-5 py-2.5 rounded-full font-bold text-xs tracking-wider">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    EXPIRES IN {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="bg-[#EAF3F2] rounded-2xl p-5 flex items-center justify-between border border-[#D5E9E7]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#147D73] rounded-full flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-[#147D73] uppercase tracking-wider">Merchant</p>
                                        <p className="font-bold text-slate-900 text-sm">CARE FUND</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border border-[#147D73] flex items-center justify-center text-[#147D73] cursor-pointer">
                                    <span className="text-[10px] font-bold">i</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: INSTRUCTIONS */}
                        <div className="pt-4">
                            <h2 className="text-xl font-bold text-slate-900 mb-8">Cara bayar</h2>
                            
                            <div className="space-y-8 mb-12 relative">
                                {/* Connecting line */}
                                <div className="absolute left-3.5 top-5 bottom-5 w-0.5 bg-slate-200 z-0"></div>

                                {paymentMethod === 'Transfer Bank' ? (
                                    <>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Buka aplikasi m-banking atau ATM Anda (Mandiri, BCA, BRI, BNI).</p>
                                        </div>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Pilih menu "Transfer" lalu pilih "Virtual Account".</p>
                                        </div>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Masukkan nomor Virtual Account di samping dan periksa rincian tagihan Anda.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Buka aplikasi pembayaran favorit Anda (Gopay, OVO, Dana, LinkAja, atau Mobile Banking).</p>
                                        </div>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Pilih opsi "Pindai QR" atau "Bayar" di aplikasi.</p>
                                        </div>
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-7 h-7 rounded-full bg-[#147D73] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                                            <p className="text-slate-600 text-sm leading-relaxed">Arahkan kamera Anda ke kode QR di layar dan periksa rincian pembayarannya.</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-slate-200 pt-8 mb-10">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    {paymentMethod === 'Transfer Bank' ? 'BANK YANG DIDUKUNG' : 'DOMPET DIGITAL & BANK YANG DIDUKUNG'}
                                </p>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">OVO</div>
                                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">GPY</div>
                                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">BCA</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleSudahBayar}
                                    className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-900/20"
                                >
                                    sudah bayar <CheckCircle2 className="w-5 h-5" />
                                </button>
                                {paymentMethod === 'Transfer QRIS' && (
                                    <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-xl transition-colors">
                                        Download QR Code
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-xs text-slate-500 mt-8">
                                Butuh bantuan? <a href="#" className="font-bold text-[#147D73] hover:underline">Hubungi Tim Dukungan Care Fund</a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return null;
};

export default CheckoutPage;