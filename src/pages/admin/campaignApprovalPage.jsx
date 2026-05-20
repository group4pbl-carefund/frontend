import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { getPendingCampaigns, updateCampaignStatus } from '../../utils/campaignDb';
import api from '../../utils/api';

const CampaignApprovalPage = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        // Filter for pending campaigns
        const apiPending = data.filter(item => (item.status || '').toLowerCase() === 'pending');
        if (apiPending.length > 0) {
          const mapped = apiPending.map(item => ({
            id: item.program_id,
            title: item.program_name || 'Kampanye Donasi Baru',
            user: item.user?.full_name || 'Relawan Peduli',
            docStatus: 'KTP & Dokumen Terverifikasi',
            category: 'Sosial Kemanusiaan',
            target: item.target_amount || 0,
            status: 'pending'
          }));
          setPendingCampaigns(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat kampanye pending dari API, menggunakan mock data:', err);
    }
    
    // Fallback to local mock data
    setPendingCampaigns(getPendingCampaigns());
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleAction = async (id, action) => {
    const isApprove = action === 'Approve';
    const nextStatus = isApprove ? 'approved' : 'rejected';
    const message = isApprove
      ? "Kampanye disetujui dan sekarang tampil di publik!"
      : "Kampanye ditolak. User akan menerima notifikasi.";

    // 1. Try backend API call
    try {
      await api.patch(`/programs/${id}`, { status: nextStatus });
    } catch (err) {
      console.warn('Gagal memperbarui status kampanye ke API, memperbarui lokal saja:', err);
    }

    // 2. Local fallback update
    updateCampaignStatus(id, nextStatus);

    await Swal.fire({
      title: isApprove ? 'Disetujui!' : 'Ditolak!',
      text: message,
      icon: isApprove ? 'success' : 'info',
      confirmButtonText: 'Selesai',
      confirmButtonColor: '#147D73'
    });
    
    fetchPendingCampaigns();
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
                <span className="text-[10px] font-black bg-teal-50 text-teal-600 px-2 py-1 rounded uppercase tracking-widest">{camp.category}</span>
                <h3 className="font-bold text-slate-800 text-lg mt-1">{camp.title}</h3>
                <p className="text-sm text-slate-400 font-medium">Oleh: {camp.user} • <span className="text-teal-600 font-bold">{camp.docStatus}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Target Dana</p>
                <p className="font-black text-slate-900 text-xl">
                  {typeof camp.target === 'number' ? `Rp ${camp.target.toLocaleString('id-ID')}` : camp.target}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(camp.id, 'Approve')} className="p-4 bg-[#147D73] text-white rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"><Check size={20} /></button>
                <button onClick={() => handleAction(camp.id, 'Reject')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><X size={20} /></button>
              </div>
            </div>
          </div>
        ))}
        {pendingCampaigns.length === 0 && (
          <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 italic font-medium">
            Semua antrean kampanye pending sudah selesai diproses!
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignApprovalPage;