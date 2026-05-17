import React, { useState } from 'react';
import { Users, Calendar, Plus, ChevronRight, LayoutDashboard, Share2 } from 'lucide-react';

const ManageCampaignPage = () => {
  const [days, setDays] = useState(15);
  
  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kelola Kampanye</h1>
          <p className="text-slate-400 mt-1 font-medium italic">Pantau perkembangan dan transparansi dana Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Share2 size={18} /> Bagikan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Donatur */}
        <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4"><Users size={24}/></div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Total Donatur</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">1,402 <span className="text-sm font-medium">Orang</span></h2>
          <button className="mt-4 text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">Lihat Semua Donatur <ChevronRight size={14}/></button>
        </div>

        {/* Sisa Waktu & Extend */}
        <div className="p-8 bg-teal-50 rounded-[2.5rem] border border-teal-100">
          <div className="bg-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4"><Calendar size={24}/></div>
          <p className="text-xs font-black text-teal-400 uppercase tracking-widest">Sisa Waktu</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-slate-900 mt-1">{days} <span className="text-sm font-medium">Hari</span></h2>
            <button onClick={() => setDays(days + 7)} className="mb-1 text-teal-600 hover:scale-110 transition-all"><Plus size={20}/></button>
          </div>
          <p className="text-[10px] text-teal-600 font-bold mt-2 uppercase underline cursor-pointer" onClick={() => setDays(days + 7)}>Perpanjang Durasi (Extend)</p>
        </div>

        {/* Persentase Dana */}
        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Pencapaian Dana</p>
          <h2 className="text-4xl font-black text-teal-400 italic">82%</h2>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-teal-500 h-full w-[82%]"></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 uppercase">Target: Rp 50.000.000</p>
        </div>
      </div>

      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800">Update Kabar Terbaru</h3>
          <p className="text-slate-400 text-sm mt-1">Berikan laporan penggunaan dana agar donatur tetap percaya.</p>
        </div>
        <button className="bg-[#147D73] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#0e5e57] transition-all shadow-xl shadow-teal-900/10">
          Buat Laporan
        </button>
      </div>
    </div>
  );
};

export default ManageCampaignPage;