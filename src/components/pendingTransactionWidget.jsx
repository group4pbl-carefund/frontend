import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, X } from 'lucide-react';
import api from '../utils/api';

const PendingTransactionWidget = () => {
    const navigate = useNavigate();
    const [pendingDonation, setPendingDonation] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchPendingTransaction = async () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (!token || !userStr) return;

            try {
                const user = JSON.parse(userStr);
                const res = await api.get('/donations');
                const donations = res.data?.data || [];
                
                // Cari transaksi milik user yang berstatus pending
                const pending = donations
                    .filter(d => d.user_id === user.id && d.payment_status?.toLowerCase() === 'pending')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                // Cari yang belum expired (expired time = created_at + 15 menit)
                const now = Date.now();
                const activePending = pending.find(d => {
                    const createdAt = new Date(d.created_at).getTime();
                    const expiresAt = createdAt + 15 * 60 * 1000;
                    return expiresAt > now;
                });

                if (activePending) {
                    setPendingDonation(activePending);
                    const createdAt = new Date(activePending.created_at).getTime();
                    const expiresAt = createdAt + 15 * 60 * 1000;
                    setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
                }
            } catch (error) {
                console.error("Gagal mengambil transaksi pending:", error);
            }
        };

        fetchPendingTransaction();
    }, []);

    useEffect(() => {
        if (!pendingDonation || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            const createdAt = new Date(pendingDonation.created_at).getTime();
            const expiresAt = createdAt + 15 * 60 * 1000;
            const newTimeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
            
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= 0) {
                clearInterval(timerId);
                setPendingDonation(null); // Sembunyikan jika expired
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [pendingDonation, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!pendingDonation || timeLeft <= 0 || !isVisible) return null;

    const handleWidgetClick = () => {
        navigate(`/donasi/${pendingDonation.program?.id || 1}/checkout`, {
            state: {
                existingDonation: true,
                donationId: pendingDonation.id,
                orderId: pendingDonation.transaction_id,
                amount: parseFloat(pendingDonation.raw_amount || pendingDonation.amount || 0),
                paymentMethod: pendingDonation.payment_method,
                campaignTitle: pendingDonation.program?.title || 'Program Donasi Care Fund',
                createdAt: pendingDonation.created_at
            }
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] w-72 md:w-80 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden group cursor-pointer relative">
                
                {/* Close Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsVisible(false);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
                >
                    <X size={14} />
                </button>

                <div 
                    onClick={handleWidgetClick}
                    className="p-4"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                        <div className="flex-1 pr-4">
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Menunggu Pembayaran</p>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">
                                {pendingDonation.program?.title || 'Program Donasi Care Fund'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black tracking-wider flex items-center gap-1">
                                    <Clock size={10} /> {formatTime(timeLeft)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 truncate">
                                    {pendingDonation.transaction_id}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-dashed border-amber-100 flex items-center justify-between text-amber-600 group-hover:text-amber-700 transition-colors">
                        <span className="text-xs font-bold">Selesaikan Sekarang</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
                
                {/* Progress bar di bagian bawah (opsional, untuk visual indikator waktu) */}
                <div className="h-1 bg-amber-100 w-full">
                    <div 
                        className="h-full bg-amber-500 transition-all duration-1000 linear"
                        style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PendingTransactionWidget;
