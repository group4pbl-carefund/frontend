import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronLeft, ChevronRight, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { formatRupiahFull, formatRupiah, formatDate } from '../../utils/format';

const ManageCampaignTab = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [distributeCampaign, setDistributeCampaign] = useState(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [distributeData, setDistributeData] = useState({ imageFile: null, imagePreview: null });

  // Pagination untuk tabel approved/completed
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        const formatBeneficiaryType = (type) => {
          if (!type) return 'Umum';
          if (type === 'diri_sendiri') return 'Diri Sendiri';
          if (type === 'keluarga') return 'Keluarga';
          if (type === 'orang_lain') return 'Orang Lain / Teman';
          if (type === 'organisasi') return 'Organisasi / Panti Asuhan';
          return type;
        };

        const mapped = data.map(item => ({
          id: item.program_id,
          title: item.program_name || 'Kampanye Donasi',
          category: item.category || 'Umum',
          organizer: item.user?.full_name || item.account_owner || 'Relawan Peduli',
          status: (item.status || 'pending').toLowerCase(),
          targetAmount: formatRupiahFull(item.target_amount || 0),
          currentAmount: formatRupiahFull(item.current_amount || 0),
          rawTarget: item.target_amount || 0,
          rawCurrent: item.current_amount || 0,
          deadline: item.end_date || 'Tidak ditentukan',
          image: item.image_url || '',
          story: item.description || "Tidak ada deskripsi",
          rab: Array.isArray(item.rab_items) ? item.rab_items : [],
          beneficiaryName: item.recipient_name || item.beneficiary_type || "Tidak ditentukan",
          beneficiaryType: formatBeneficiaryType(item.beneficiary_type),
          documents: Array.isArray(item.documents) ? item.documents : [],
          submittedBy: item.user?.full_name || item.user_name || 'user',
          submittedAt: item.created_at ? formatDate(item.created_at) : 'Baru saja',
          bankName: item.bank_name || '-',
          accountNumber: item.account_number || '-',
          accountOwner: item.account_owner || '-',
          distribution: item.distribution ? {
            id: item.distribution.id,
            recipientName: item.distribution.recipient_name || '-',
            amount: item.distribution.formatted_amount || '-',
            status: item.distribution.status || '-',
            evidenceUrl: item.distribution.evidence_url || null,
            date: item.distribution.created_at || '-',
          } : null
        }));

        setCampaigns(mapped);
      }
    } catch (err) {
      console.warn('Gagal memuat kampanye dari API:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Mencegah scroll bocor ke halaman belakang saat modal terbuka
  useEffect(() => {
    if (selectedCampaign || distributeCampaign) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCampaign, distributeCampaign]);

  const handleOpenModal = (campaign) => {
    setSelectedCampaign(campaign);
    setFeedbackNotes("");
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const handleOpenDistribute = (campaign) => {
    setDistributeCampaign(campaign);
    setDistributeData({ imageFile: null, imagePreview: null });
  };

  const handleCloseDistribute = () => {
    setDistributeCampaign(null);
  };

    const handleAction = async (actionType) => {
      let nextStatus = 'pending';
      if (actionType === 'Approve') nextStatus = 'approved';
      if (actionType === 'Reject') nextStatus = 'rejected';
      if (actionType === 'Request Revision') nextStatus = 'revision';
  
      if ((actionType === 'Reject' || actionType === 'Request Revision') && !feedbackNotes.trim()) {
        Swal.fire({
          title: 'Perhatian!',
          text: 'Harap isi catatan atau feedback untuk kreator.',
          icon: 'warning',
          confirmButtonColor: '#147D73'
        });
        return;
      }
  
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
      fetchCampaigns();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memperbarui status kampanye.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    }
  };

  const handleDistributeSubmit = async () => {
    if (!distributeData.imageFile) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap unggah bukti transfer.',
        icon: 'warning',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('program_id', distributeCampaign.id);
      formData.append('recipient_name', distributeCampaign.beneficiaryName);
      formData.append('amount', distributeCampaign.rawCurrent);
      formData.append('status', 'Tersalurkan');
      formData.append('evidence_image', distributeData.imageFile);

      await api.post('/distributions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await Swal.fire({
        title: 'Berhasil!',
        text: 'Dana berhasil disalurkan dan bukti tercatat.',
        icon: 'success',
        confirmButtonColor: '#147D73'
      });
      handleCloseDistribute();
      fetchCampaigns();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data penyaluran.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    }
  };

  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  let activeCampaigns = campaigns.filter(c => c.status === 'approved' || c.status === 'completed');

  if (searchTerm) {
    activeCampaigns = activeCampaigns.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const totalPages = Math.ceil(activeCampaigns.length / itemsPerPage);
  const displayedActiveCampaigns = activeCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent space-y-10">

      {/* SECTION: PENDING APPROVALS */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[#147D73] rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pending Approvals</h1>
            <p className="text-slate-500 text-sm mt-1">Tinjau kampanye baru yang menunggu persetujuan.</p>
          </div>
        </div>

        <div className="space-y-4">
          {pendingCampaigns.length === 0 && (
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 italic font-medium shadow-sm">
              Semua antrean kampanye pending sudah selesai diproses!
            </div>
          )}
          {pendingCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:border-[#147D73] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-1 inline-block">
                    {campaign.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{campaign.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Oleh: {campaign.organizer} <span className="mx-1">•</span>
                    <span className="font-bold text-orange-500">Tahap Verifikasi</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0 border-gray-100">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target Dana</p>
                  <p className="font-extrabold text-slate-900">{campaign.targetAmount}</p>
                </div>
                <button
                  onClick={() => handleOpenModal(campaign)}
                  className="bg-[#E8F3F1] text-[#147D73] hover:bg-[#147D73] hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Review Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: ACTIVE & COMPLETED CAMPAIGNS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Kampanye</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola kampanye yang sedang aktif atau sudah selesai.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kampanye..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D73] w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kampanye</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Terkumpul</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedActiveCampaigns.map((campaign) => {
                  const isCompleted = campaign.status === 'completed';
                  const isDistributed = !!campaign.distribution;
                  const progress = campaign.rawTarget > 0 ? Math.min((campaign.rawCurrent / campaign.rawTarget) * 100, 100) : 0;

                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={campaign.image || '/placeholder.jpg'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{campaign.title}</p>
                            <p className="text-xs text-gray-500">{campaign.organizer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#147D73]">{campaign.currentAmount}</p>
                        <p className="text-xs text-gray-500">dari {campaign.targetAmount}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-[#147D73] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${isCompleted ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {isCompleted ? 'Selesai' : 'Belum Selesai'}
                          </span>
                          {isDistributed && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold w-fit bg-green-50 text-green-700">
                              ✓ Telah Disalurkan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {isCompleted && !isDistributed && (
                          <button
                            onClick={() => handleOpenDistribute(campaign)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors">
                            Salurkan Dana
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(campaign)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-200 hover:border-[#147D73] hover:text-[#147D73] rounded-lg text-xs font-bold text-gray-600 transition-colors">
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {displayedActiveCampaigns.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">
                      Tidak ada data kampanye ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Menampilkan <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-bold">{Math.min(currentPage * itemsPerPage, activeCampaigns.length)}</span> dari <span className="font-bold">{activeCampaigns.length}</span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY: REVIEW & DETAIL KAMPANYE (Modal yang sama dengan sebelumnya) */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          <div className="relative bg-[#F8FAFA] w-full max-w-6xl max-h-[95vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

            <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Programs / Detail</span>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  Detail Campaign: <span className="text-[#147D73] truncate max-w-md">{selectedCampaign.title}</span>
                  <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider ${selectedCampaign.status === 'pending' ? 'bg-[#A4EBE0] text-[#0F655C]' :
                      selectedCampaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                    }`}>
                    {selectedCampaign.status}
                  </span>
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Terkumpul</p>
                        <p className="font-extrabold text-[#147D73] text-2xl">{selectedCampaign.currentAmount}</p>
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
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  {/* Decision Panel - ONLY FOR PENDING */}
                  {selectedCampaign.status === 'pending' && (
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
                          className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
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
                    </div>
                  )}

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
                              <a href={doc.url ? (doc.url.startsWith('http') ? doc.url : `http://localhost:8000${doc.url}`) : '#'} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#147D73] hover:underline">
                                {doc.name || 'Dokumen Terlampir'}
                              </a>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-slate-400 italic font-medium p-4 text-sm">Belum ada dokumen</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Distribution Detail - only if distributed */}
                  {selectedCampaign.distribution && (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-2 mb-5">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-green-800">Informasi Penyaluran Dana</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Disalurkan Kepada</p>
                          <p className="font-bold text-slate-900 text-sm">{selectedCampaign.distribution.recipientName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Nominal Disalurkan</p>
                          <p className="font-bold text-green-700 text-sm">{selectedCampaign.distribution.amount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Status</p>
                          <p className="font-bold text-slate-900 text-sm">{selectedCampaign.distribution.status}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Tanggal</p>
                          <p className="font-bold text-slate-900 text-sm">{selectedCampaign.distribution.date}</p>
                        </div>
                      </div>
                      {selectedCampaign.distribution.evidenceUrl && (
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2">Bukti Transfer</p>
                          <img
                            src={selectedCampaign.distribution.evidenceUrl}
                            alt="Bukti Transfer"
                            className="w-full max-h-64 object-contain rounded-2xl border border-green-200 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: DISTRIBUTE FUNDS MODAL */}
      {distributeCampaign && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseDistribute}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95">
            <button onClick={handleCloseDistribute} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Salurkan Dana</h2>
              <p className="text-sm text-slate-500 mt-2">Salurkan dana yang telah terkumpul ke rekening kreator kampanye.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">Terkumpul</span>
                <span className="text-lg font-extrabold text-[#147D73]">{distributeCampaign.currentAmount}</span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Bank</span>
                  <span className="text-xs font-bold text-slate-900">{distributeCampaign.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">No. Rekening</span>
                  <span className="text-xs font-bold text-slate-900">{distributeCampaign.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">A.N</span>
                  <span className="text-xs font-bold text-slate-900">{distributeCampaign.accountOwner}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Upload Bukti Transfer</label>
              <label className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                {distributeData.imagePreview ? (
                  <div className="relative">
                    <img src={distributeData.imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white text-xs font-bold">Ubah</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-[#147D73]">Pilih File Bukti (Image)</span>
                    <span className="text-[10px] text-slate-400 mt-1">JPG, PNG max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setDistributeData({
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file)
                      });
                    }
                  }}
                />
              </label>
            </div>

            <button
              onClick={handleDistributeSubmit}
              className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Konfirmasi Penyaluran
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCampaignTab;