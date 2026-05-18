import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import { getCampaignById } from '../utils/campaignDb';
import Swal from 'sweetalert2';

// --- KOMPONEN 1: SIDEBAR DONASI (STICKY) ---
const DonationSidebar = ({ campaign }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(100000);
  const [selectedMethod, setSelectedMethod] = useState('');

  const amounts = [50000, 100000, 250000, 500000, 1000000];

  if (!campaign) return null;

  const progressPercentage = Math.min(100, Math.round((campaign.collected / campaign.target) * 100));

  const handleNextPayment = () => {
    if (!selectedMethod) {
      Swal.fire({
        title: 'Pilih Metode Pembayaran!',
        text: 'Silakan pilih salah satu metode transfer pembayaran donasi.',
        icon: 'warning',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    navigate(`/donasi/${campaign.id}/checkout`, { 
      state: { 
        amount: Number(selectedAmount) || 100000, 
        method: selectedMethod,
        programTitle: campaign.title 
      } 
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 sticky top-24">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Berdonasi Sekarang</h3>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-2xl font-extrabold text-[#147D73]">Rp {campaign.collected.toLocaleString('id-ID')}</div>
            <div className="text-xs text-slate-500 mt-1">Terkumpul dari Rp {campaign.target.toLocaleString('id-ID')}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900">{progressPercentage}%</div>
            <div className="text-xs text-slate-500">Tercapai</div>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#147D73] rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="text-xs font-bold text-slate-600 mt-3 flex items-center">
          <svg className="w-4 h-4 mr-1.5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {campaign.donorsCount.toLocaleString('id-ID')} <span className="font-medium text-slate-500 ml-1">orang telah berdonasi</span>
        </div>
      </div>

      {/* Input Nominal */}
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Jumlah Donasi</label>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-[#147D73] font-bold">Rp</span>
          </div>
          <input 
            type="number" 
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            className="w-full bg-[#E8F3F1] text-slate-900 font-bold text-lg rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#147D73]"
          />
        </div>
        
        {/* Quick Amounts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amounts.map((amount) => (
            <button 
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                Number(selectedAmount) === amount 
                  ? 'border-[#147D73] bg-[#E8F3F1] text-[#147D73]' 
                  : 'border-gray-200 text-slate-600 hover:border-[#147D73]'
              }`}
            >
              {amount.toLocaleString('id-ID')}
            </button>
          ))}
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Metode Pembayaran</label>
        <div className="space-y-2">
          {['Transfer Bank', 'Transfer E-Money', 'Transfer QRIS'].map((method) => (
            <label key={method} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
              selectedMethod === method ? 'border-[#147D73] bg-[#E8F3F1]/30' : 'border-gray-200 hover:border-[#147D73]'
            }`}>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="payment_method" 
                  value={method}
                  checked={selectedMethod === method}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-4 h-4 text-[#147D73] focus:ring-[#147D73]"
                />
                <span className="ml-3 text-xs font-bold text-slate-700">{method}</span>
              </div>
              <span className="text-[10px] font-bold bg-gray-100 text-slate-500 px-2 py-1 rounded">{method.split(' ')[1]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button 
        onClick={handleNextPayment}
        className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 rounded-xl transition-colors mb-4 shadow-sm text-sm"
      >
        Lanjut Pembayaran
      </button>

      {/* Security Note */}
      <div className="text-center">
        <div className="inline-flex items-center text-xs font-bold text-slate-700 mb-1">
          <svg className="w-3.5 h-3.5 mr-1 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          KEAMANAN TERJAMIN
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Donasi akan dikelola transparan. Potongan operasional 5% untuk keberlangsungan sistem.
        </p>
      </div>
    </div>
  );
};


// --- HALAMAN UTAMA ---
const DonationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State untuk melacak tab yang aktif
  const [activeTab, setActiveTab] = useState('Deskripsi');

  // Ambil data kampanye secara dinamis
  const campaign = getCampaignById(id);

  if (!campaign) {
    return (
      <MainLayout>
        <div className="bg-[#F4F7F6] min-h-screen pb-24 pt-20 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Program Donasi Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8 max-w-sm">Maaf, penggalangan dana yang Anda cari tidak aktif atau telah berakhir.</p>
          <button 
            onClick={() => navigate('/donasi')}
            className="bg-[#147D73] hover:bg-[#0c5952] text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Lihat Program Lain
          </button>
        </div>
      </MainLayout>
    );
  }

  // Data Dummy untuk Tab Donatur
  const donorsData = [
    { id: 1, name: 'Ahmad Faisal', amount: 'Rp 500.000', message: '"Semoga bermanfaat untuk adik-adik di sana, tetap semangat belajarnya!"', time: '2 MENIT YANG LALU', isAnonymous: false },
    { id: 2, name: 'Hamba Allah', amount: 'Rp 1.000.000', message: 'Semoga jadi amal jariyah. Amin.', time: '15 MENIT YANG LALU', isAnonymous: true },
    { id: 3, name: 'Siti Rahma', amount: 'Rp 50.000', message: '"Sedikit yang penting ikhlas."', time: '1 JAM YANG LALU', isAnonymous: false },
  ];

  return (
    <MainLayout>
      <div className="bg-[#F4F7F6] min-h-screen pb-24 pt-6">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          
          {/* Tombol Back */}
          <button onClick={() => navigate('/donasi')} className="mb-6 hover:bg-gray-200 p-2 rounded-full transition-colors flex items-center gap-1.5 text-sm font-bold text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Program
          </button>

          {/* GRID UTAMA - CLASS 'items-start' ADALAH KUNCI AGAR STICKY BERFUNGSI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* KOLOM KIRI (KONTEN) - Mengambil 2 kolom */}
            <div className="lg:col-span-2">
              
              {/* Image & Header */}
              <div className="relative w-full aspect-video rounded-[24px] overflow-hidden mb-6 bg-gray-200 shadow-sm border border-gray-100">
                <img 
                  src={campaign.imageSrc || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80"} 
                  alt={campaign.category} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#147D73] text-xs font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
                  {campaign.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                {campaign.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#E8F3F1] text-[#147D73] flex items-center justify-center font-black text-sm uppercase">
                  {campaign.user.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{campaign.user}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Fundraiser Terverifikasi • CareFund Member</p>
                </div>
              </div>

              {/* Tabs */}
             <div className="flex border-b border-gray-200 mb-8">
                {['Deskripsi', 'Update', 'Donatur'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-6 text-sm font-bold transition-colors ${
                      activeTab === tab 
                        ? 'text-[#147D73] border-b-2 border-[#147D73]' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Deskripsi' && (
                <div>
                  <div className="text-slate-600 leading-relaxed space-y-4 mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Tentang Program</h2>
                    <p className="whitespace-pre-wrap">{campaign.description}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                    <div>
                      <svg className="w-5 h-5 text-[#147D73] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Target Dana</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">Rp {campaign.target.toLocaleString('id-ID')}</div>
                    </div>
                    <div>
                      <svg className="w-5 h-5 text-[#147D73] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Penerima</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5 truncate">{campaign.recipientName}</div>
                    </div>
                    <div>
                      <svg className="w-5 h-5 text-[#147D73] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Kategori</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5 uppercase tracking-wide text-xs">{campaign.category}</div>
                    </div>
                    <div>
                      <svg className="w-5 h-5 text-[#147D73] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Sisa Waktu</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{campaign.daysLeft} Hari</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Update' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 space-y-6">
                  {campaign.updates && campaign.updates.length > 0 ? (
                    campaign.updates.map((update) => (
                      <div key={update.id} className="border-l-2 border-[#147D73] pl-4 py-1">
                        <div className="text-xs font-bold text-slate-400 mb-1">{update.date}</div>
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Kabar Terbaru Penggalangan</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{update.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 italic font-medium">
                      Belum ada laporan kabar terbaru yang diterbitkan untuk program donasi ini.
                    </div>
                  )}
                </div>
              )}

              {/* === KONTEN TAB: DONATUR === */}
              {activeTab === 'Donatur' && (
                <div className="space-y-4">
                  {donorsData.map((donor) => (
                    <div key={donor.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${donor.isAnonymous ? 'bg-gray-100 text-gray-400' : 'bg-[#A4EBE0] text-[#0F655C]'}`}>
                          {donor.isAnonymous ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          )}
                        </div>
                        {/* Detail Donatur */}
                        <div>
                          <h4 className="font-bold text-slate-900">{donor.name}</h4>
                          {donor.message && (
                            <p className="text-sm text-slate-600 mt-1 italic">{donor.message}</p>
                          )}
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                            {donor.time}
                          </div>
                        </div>
                      </div>
                      {/* Nominal Donasi */}
                      <div className="font-extrabold text-[#147D73]">
                        {donor.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* KOLOM KANAN (SIDEBAR) - Memanggil komponen terpisah */}
            <div className="lg:col-span-1">
              <DonationSidebar campaign={campaign} />
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DonationDetailPage;