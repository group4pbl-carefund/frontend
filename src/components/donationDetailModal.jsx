import React from 'react';
import { X, Copy, CheckCircle2, Clock, CreditCard, Receipt, HandHeart, Download, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const DonationDetailModal = ({ donation, onClose }) => {
    if (!donation) return null;

    const isSuccess = ['success', 'paid', 'settlement', 'completed'].includes(donation.payment_status?.toLowerCase());
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: 'Tersalin!',
            text: 'ID Transaksi disalin ke clipboard.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="relative pt-6 px-6 pb-4 border-b border-slate-50 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Detail Transaksi</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-500 text-xs">{donation.transaction_id}</span>
                            <button onClick={() => handleCopy(donation.transaction_id)} className="text-slate-400 hover:text-[#147D73] transition-colors">
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    
                    {/* Status Badge */}
                    <div className="flex flex-col items-center justify-center py-4 mb-6">
                        {isSuccess ? (
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                                <Clock size={32} className="text-amber-500" />
                            </div>
                        )}
                        <h3 className={`text-xl font-black ${isSuccess ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isSuccess ? 'Donasi Berhasil' : 'Menunggu Pembayaran'}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">{donation.date}</p>
                    </div>

                    {/* Program Info Mini Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center mb-6">
                        <img 
                            src={donation.program?.image_url} 
                            alt={donation.program?.title}
                            className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                            <span className="text-[10px] font-bold text-[#147D73] uppercase">{donation.program?.category}</span>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 mt-0.5">{donation.program?.title}</h4>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm">Rincian Pembayaran</h4>
                        
                        <div className="space-y-3 bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <CreditCard size={16} /> Metode Pembayaran
                                </span>
                                <span className="font-bold text-slate-900 uppercase">{donation.payment_method}</span>
                            </div>
                            <hr className="border-slate-50" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Nominal Donasi</span>
                                <span className="font-medium text-slate-900">{donation.formatted_amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Biaya Platform / Fee</span>
                                <span className="font-medium text-slate-900">{donation.formatted_fee}</span>
                            </div>
                            <div className="pt-3 mt-1 border-t border-dashed border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-900">Total Pembayaran</span>
                                <span className="text-xl font-black text-[#147D73]">{donation.formatted_total}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                    {isSuccess ? (
                        <>
                           {/* <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm">
                                <Receipt size={16} /> Invoice
                            </button> */}
                            <Link to={`/donasi/${donation.program?.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#147D73] text-white font-bold rounded-xl hover:bg-[#0F655C] hover:shadow-lg hover:shadow-teal-900/20 transition-all text-sm">
                                <HandHeart size={16} /> Donasi Lagi
                            </Link>
                        </>
                    ) : (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 hover:shadow-lg transition-all text-sm shadow-sm">
                            Selesaikan Pembayaran <ChevronRight size={16} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DonationDetailModal;
