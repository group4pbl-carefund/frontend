import React, { useState } from 'react';
import { Check, X, Eye, ShieldCheck, FileText } from 'lucide-react';

const CampaignApprovalPage = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([
    { 
      id: 1, 
      title: "Bantuan Pangan Korban Banjir", 
      user: "Relawan Kita", 
      docStatus: "KTP Terverifikasi",
      category: "Bencana Alam",
      target: "Rp 50.000.000" 
    },
    { 
      id: 2, 
      title: "Beasiswa Anak Yatim Piatu", 
      user: "Yayasan Amanah", 
      docStatus: "Dokumen Yayasan Lengkap",
      category: "Pendidikan",
      target: "Rp 120.000.000" 
    },
  ]);

  const handleAction = (id, action) => {
    const message = action === 'Approve' 
      ? "Kampanye disetujui dan sekarang tampil di publik!" 
      : "Kampanye ditolak. User akan menerima notifikasi.";
    alert(message);
    setPendingCampaigns(pendingCampaigns.filter(c => c.id !== id));
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-lg"><ShieldCheck size={32} /></div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">Review Panel</h1>
          <p className="text-slate-500">Tinjau kampanye baru dari Tahap 3 Verifikasi.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pendingCampaigns.map((camp) => (
          <div key={camp.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="bg-slate-100 p-4 rounded-2xl text-slate-400"><FileText size={24} /></div>
              <div>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-widest">{camp.category}</span>
                <h3 className="font-bold text-slate-800 text-lg mt-1">{camp.title}</h3>
                <p className="text-sm text-slate-400 font-medium">Oleh: {camp.user} • <span className="text-teal-600 font-bold">{camp.docStatus}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Target Dana</p>
                <p className="font-black text-slate-900 text-xl">{camp.target}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(camp.id, 'Approve')} className="p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"><Check size={20}/></button>
                <button onClick={() => handleAction(camp.id, 'Reject')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><X size={20}/></button>
              </div>
            </div>
          </div>
        ))}
        {pendingCampaigns.length === 0 && <p className="text-center py-20 text-slate-400 italic font-medium">Semua antrean sudah diproses.</p>}
      </div>
    </div>
  );
};

export default CampaignApprovalPage;