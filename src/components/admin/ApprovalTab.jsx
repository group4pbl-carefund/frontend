import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { formatRupiahFull, formatDate } from '../../utils/format';

const CampaignApprovalTab = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPendingCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        // Filter for pending campaigns
        const apiPending = data.filter(item => (item.status || '').toLowerCase() === 'pending');
        const formatBeneficiaryType = (type) => {
          if (!type) return 'Umum';
          if (type === 'diri_sendiri') return 'Diri Sendiri';
          if (type === 'keluarga') return 'Keluarga';
          if (type === 'orang_lain') return 'Orang Lain / Teman';
          if (type === 'organisasi') return 'Organisasi / Panti Asuhan';
          return type;
        };
        const mapped = apiPending.map(item => ({
          id: item.program_id,
          title: item.program_name || 'Kampanye Donasi Baru',
          category: item.category || 'Umum',
          organizer: item.user?.full_name || item.account_owner || 'Relawan Peduli',
          statusText: "Tahap Verifikasi",
          statusColor: "text-[#147D73]",
          targetAmount: formatRupiahFull(item.target_amount || 0),
          deadline: item.end_date || 'Tidak ditentukan',
          image: item.image_url || "https://images.unsplash.com/photo-1538108149393-cebb47acdd4e?auto=format&fit=crop&w=800&q=80",
          story: item.description || "Tidak ada deskripsi",
          rab: Array.isArray(item.rab_items) ? item.rab_items : [],
          beneficiaryName: item.recipient_name || item.beneficiary_type || "Tidak ditentukan",
          beneficiaryType: formatBeneficiaryType(item.beneficiary_type),
          documents: Array.isArray(item.documents) ? item.documents : [],
          submittedBy: item.user?.full_name || item.user_name || 'user',
          submittedAt: item.created_at ? formatDate(item.created_at) : 'Baru saja'
        }));
        setPendingCampaigns(mapped);
      }
    } catch (err) {
      console.warn('Gagal memuat kampanye pending dari API:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  // Mencegah scroll bocor ke halaman belakang
  useEffect(() => {
    if (selectedCampaign) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCampaign]);

  const handleOpenModal = (campaign) => {
    setSelectedCampaign(campaign);
    setFeedbackNotes("");
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const handleAction = async (actionType) => {
    let nextStatus = 'pending';
    if (actionType === 'Approve') nextStatus = 'approved';
    if (actionType === 'Reject') nextStatus = 'rejected';
    if (actionType === 'Request Revision') nextStatus = 'revision';

    const message = actionType === 'Approve'
      ? "Kampanye disetujui dan sekarang tampil di publik!"
      : actionType === 'Reject' ? "Kampanye ditolak. User akan menerima notifikasi."
        : "Permintaan revisi berhasil dikirim.";

    try {
      await api.patch(`/programs/${selectedCampaign.id}`, {
        status: nextStatus,
        admin_feedback: feedbackNotes
      });
      await Swal.fire({
        title: 'Berhasil!',
        text: message,
        icon: 'success',
        confirmButtonColor: '#147D73'
      });
      handleCloseModal();
      fetchPendingCampaigns();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memperbarui status kampanye.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#147D73] rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Tinjau kampanye baru dari Tahap 3 Verifikasi.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingCampaigns.length === 0 && (
          <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 italic font-medium">
            Semua antrean kampanye pending sudah selesai diproses!
          </div>
        )}
        {pendingCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => handleOpenModal(campaign)}
            className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:border-[#147D73] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0 group-hover:bg-[#E8F3F1] transition-colors">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-1 inline-block">
                  {campaign.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{campaign.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Oleh: {campaign.organizer} <span className="mx-1">•</span>
                  <span className={`font-bold ${campaign.statusColor}`}>{campaign.statusText}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0 border-gray-100">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target Dana</p>
                <p className="font-extrabold text-slate-900">{campaign.targetAmount}</p>
              </div>
              <button className="bg-[#E8F3F1] text-[#147D73] hover:bg-[#147D73] hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Review Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          <div className="relative bg-[#F8FAFA] w-full max-w-6xl max-h-[95vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

            <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Programs / Pending Approval</span>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  Review Campaign: <span className="text-[#147D73] truncate max-w-md">{selectedCampaign.title}</span>
                  <span className="bg-[#A4EBE0] text-[#0F655C] text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Pending Review</span>
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <div className="lg:col-span-2 space-y-6">
                  {/* Campaign Basics */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <svg className="w-5 h-5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h3 className="font-bold text-slate-900">Campaign Basics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campaign Title</p>
                        <p className="font-semibold text-slate-900">{selectedCampaign.title}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                        <p className="font-semibold text-slate-900">{selectedCampaign.category}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Amount</p>
                        <p className="font-extrabold text-[#147D73] text-2xl">{selectedCampaign.targetAmount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
                        <p className="font-semibold text-slate-900">{selectedCampaign.deadline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Story & Media */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <svg className="w-5 h-5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <h3 className="font-bold text-slate-900">Story & Media</h3>
                    </div>
                    <img src={selectedCampaign.image} alt="Campaign" className="w-full h-64 object-cover rounded-2xl mb-6" />
                    <h4 className="font-bold text-slate-900 mb-2">The Narrative</h4>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedCampaign.story}
                    </p>
                  </div>

                  {/* Budget Allocation */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <h3 className="font-bold text-slate-900">Budget Allocation (RAB)</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{selectedCampaign.rab.length} line items</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {selectedCampaign.rab.length > 0 ? selectedCampaign.rab.map((item, idx) => (
                        <div key={item.id || idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm">
                              <Package size={20} className="text-[#147D73]" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{item.desc || item.description || 'Item RAB'}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 text-sm">
                            {formatRupiahFull(item.amount)}
                          </span>
                        </div>
                      )) : (
                        <div className="text-center text-slate-400 italic font-medium p-4">Tidak ada data RAB</div>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="font-bold text-slate-900">Total Target</span>
                      <span className="font-extrabold text-[#147D73] text-xl">{selectedCampaign.targetAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  {/* Decision Panel */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#147D73] mb-4">Decision Panel</h3>
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Feedback/Notes</label>
                      <textarea
                        rows="4"
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        placeholder="Type internal feedback or public revision notes..."
                        className="w-full bg-slate-100 text-slate-700 text-sm p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73]/20 border-none resize-none"
                      ></textarea>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAction('Approve')}
                        className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        Approve Campaign
                      </button>
                      <button
                        onClick={() => handleAction('Request Revision')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Request Revision
                      </button>
                      <button
                        onClick={() => handleAction('Reject')}
                        className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Reject with Feedback
                      </button>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Last Modified</p>
                        <p className="text-xs text-slate-600">Submitted {selectedCampaign.submittedAt} by <span className="font-bold text-slate-900">User: {selectedCampaign.submittedBy}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Verification */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <svg className="w-5 h-5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <h3 className="font-bold text-slate-900">Verification</h3>
                    </div>
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Beneficiary Name</p>
                      <p className="font-bold text-slate-900">{selectedCampaign.beneficiaryName}</p>
                      <p className="text-xs text-slate-500">{selectedCampaign.beneficiaryType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Documents</p>
                      <div className="space-y-2">
                        {selectedCampaign.documents.length > 0 ? selectedCampaign.documents.map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                              <span className="text-xs font-bold text-slate-700">{doc.name || 'Dokumen Terlampir'}</span>
                            </div>
                            <button className="text-slate-400 hover:text-[#147D73] transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                          </div>
                        )) : (
                          <div className="text-center text-slate-400 italic font-medium p-4 text-sm">Belum ada dokumen</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignApprovalTab;