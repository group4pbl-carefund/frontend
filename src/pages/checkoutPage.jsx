import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import { CheckCircle2, Copy, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state (passed from detail page)
  const { amount = 100000, programTitle = 'Bantuan Pendidikan Anak Pedalaman Kalimantan', method = 'Transfer Bank' } = location.state || {};
  
  const [isCopied, setIsCopied] = useState(false);
  const [step, setStep] = useState(1); // 1: Instruction, 2: Upload, 3: Success

  const adminFee = amount * 0.05;
  const totalAmount = parseInt(amount) + adminFee;

  const handleCopy = () => {
    navigator.clipboard.writeText('8832 0812 3456 7890');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F4F7F6] pb-24 pt-12">
        <div className="max-w-3xl mx-auto px-6">
          
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-bold text-slate-500 hover:text-[#147D73] transition-colors mb-8"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </button>

          {step < 3 && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#147D73] p-8 text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Konfirmasi Pembayaran</span>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
                    <ShieldCheck size={12} /> SECURE CHECKOUT
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-1">{programTitle}</h1>
                <p className="text-white/70 text-sm">Selesaikan pembayaran Anda untuk memproses donasi ini.</p>
              </div>

              <div className="p-8">
                {step === 1 && (
                  <div className="animate-in fade-in duration-500">
                    <div className="flex flex-col items-center justify-center py-6 border-b border-gray-50 mb-8">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2">Total yang harus dibayar</span>
                      <div className="text-4xl font-black text-slate-900">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        Donasi: Rp {parseInt(amount).toLocaleString('id-ID')} + Biaya Sistem: Rp {adminFee.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Instruksi Pembayaran ({method})</label>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nomor Virtual Account</p>
                            <p className="text-xl font-mono font-bold text-slate-800">8832 0812 3456 7890</p>
                            <p className="text-xs text-slate-500 mt-1">Bank Mandiri a/n Care Fund Foundation</p>
                          </div>
                          <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isCopied ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-[#147D73] border border-gray-200 shadow-sm hover:border-[#147D73]'}`}
                          >
                            {isCopied ? <><CheckCircle2 size={14} /> Tersalin</> : <><Copy size={14} /> Salin</>}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E8F3F1] text-[#147D73] flex items-center justify-center text-xs font-bold shrink-0">1</div>
                          <p className="text-sm text-slate-600">Masuk ke aplikasi mobile banking atau ATM pilihan Anda.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E8F3F1] text-[#147D73] flex items-center justify-center text-xs font-bold shrink-0">2</div>
                          <p className="text-sm text-slate-600">Pilih menu <span className="font-bold">Pembayaran / Virtual Account</span>.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E8F3F1] text-[#147D73] flex items-center justify-center text-xs font-bold shrink-0">3</div>
                          <p className="text-sm text-slate-600">Masukkan nomor Virtual Account di atas dan pastikan nominal sesuai.</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => setStep(2)}
                          className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#147D73]/20"
                        >
                          Saya Sudah Transfer
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-4">
                          Pembayaran Anda akan diverifikasi otomatis dalam 1-5 menit. <br/>Jika terkendala, silakan unggah bukti transfer di langkah berikutnya.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Unggah Bukti Transfer</h3>
                    <p className="text-sm text-slate-500 mb-8">Bantu kami memverifikasi donasi Anda lebih cepat dengan mengunggah tangkapan layar bukti transfer.</p>
                    
                    <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors mb-8">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
                        <CreditCard size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Klik untuk pilih file atau seret ke sini</p>
                      <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau PDF (Maks. 5MB)</p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setStep(1)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={() => setStep(3)}
                        className="flex-[2] bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#147D73]/20"
                      >
                        Konfirmasi & Selesai
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-12 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-[#E8F3F1] text-[#147D73] rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
                ✓
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-3">Terima Kasih!</h1>
              <p className="text-slate-500 mb-10 font-medium px-8 leading-relaxed max-w-md mx-auto">
                Donasi Anda telah kami terima dan akan segera diproses. Semoga menjadi amal jariyah yang terus mengalir.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/user-profile')}
                  className="bg-[#147D73] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#147D73]/20 hover:bg-[#0F655C] transition-all"
                >
                  Lihat Riwayat Donasi
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Kembali ke Beranda
                </button>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sertifikat Donasi Anda</p>
                <div className="bg-[#A4EBE0]/20 rounded-2xl p-6 border border-[#A4EBE0]/30 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">E-Sertifikat Tersedia</p>
                    <p className="text-[10px] text-slate-500">Anda dapat mengunduh sertifikat di halaman profil.</p>
                  </div>
                  <button className="text-[#147D73] font-black text-xs hover:underline uppercase">Unduh Sekarang</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
