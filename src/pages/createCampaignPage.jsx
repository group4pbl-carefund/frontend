import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../utils/api';
import { formatDate } from '../utils/format';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  const [currentStep, setCurrentStep] = useState(1);
  const [beneficiaryType, setBeneficiaryType] = useState(editData?.beneficiary_type || 'diri_sendiri');
  const [durationMode, setDurationMode] = useState(editData?.end_date ? 'date' : 'days');

  const [formData, setFormData] = useState({
    title: editData?.program_name || '',
    category: editData?.category || 'Kesehatan',
    durationDays: '',
    deadlineDate: editData?.end_date || '',
    target: editData?.target_amount 
      ? Math.floor(Number(editData.target_amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
      : '',
    description: editData?.description || '',
    recipientName: editData?.recipient_name || '',
    bankName: editData?.bank_name || 'Bank BCA',
    accountNumber: editData?.account_number || '',
    accountOwner: editData?.account_owner || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editData?.image_url || '');
  const [rabItems, setRabItems] = useState(
    editData?.rab_items?.length > 0
      ? editData.rab_items.map((item, idx) => ({ 
          id: idx + 1, 
          description: item.description, 
          amount: Math.floor(Number(item.amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
        }))
      : [{ id: 1, description: '', amount: '' }]
  );

  // Mendapatkan tanggal hari ini dengan format YYYY-MM-DD untuk batasan input kalender
  const today = new Date().toISOString().split('T')[0];

  const handleAddRab = () => {
    setRabItems([...rabItems, { id: Date.now(), description: '', amount: '' }]);
  };

  const handleRemoveRab = (id) => {
    if (rabItems.length > 1) {
      setRabItems(rabItems.filter(item => item.id !== id));
    }
  };

  const handleRabChange = (id, field, value) => {
    const updated = rabItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRabItems(updated);
  };

  const totalRabEstimation = rabItems.reduce((sum, item) => {
    const amt = parseFloat(item.amount.toString().replace(/\./g, '')) || 0;
    return sum + amt;
  }, 0);

  const getComputedEndDate = () => {
    if (!formData.durationDays) return '-';
    const startDate = new Date();
    const endDate = new Date(startDate);
    const duration = parseInt(formData.durationDays) || 0;
    endDate.setDate(startDate.getDate() + duration);
    return formatDate(endDate, 'long');
  };

  const getComputedDuration = () => {
    if (!formData.deadlineDate) return '-';
    const selectedDate = new Date(formData.deadlineDate);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // reset time
    selectedDate.setHours(0, 0, 0, 0);
    const diffTime = selectedDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.target || !formData.description.trim() || !formData.recipientName.trim()) {
      Swal.fire({
        title: 'Formulir Belum Lengkap!',
        text: 'Harap lengkapi judul kampanye, nominal target dana, cerita lengkap, dan identitas penerima manfaat.',
        icon: 'warning',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    const rawTarget = parseFloat(formData.target.replace(/\./g, '')) || 0;
    if (rawTarget < 1000000) {
      Swal.fire({
        title: 'Target Dana Terlalu Rendah!',
        text: 'Minimal target dana penggalangan adalah Rp 1.000.000.',
        icon: 'warning',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    // Mengambil user ID yang sedang login
    const loggedUser = localStorage.getItem('user');
    let userId = null;
    if (loggedUser) {
      const parsed = JSON.parse(loggedUser);
      userId = parsed.id;
    }

    if (!userId) {
      Swal.fire({
        title: 'Sesi Tidak Valid',
        text: 'Anda harus login terlebih dahulu untuk membuat kampanye.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
      return;
    }

    const startDate = new Date();
    let endDate = new Date(startDate);
    if (durationMode === 'days') {
      const duration = parseInt(formData.durationDays) || 0;
      endDate.setDate(startDate.getDate() + duration);
    } else {
      if (formData.deadlineDate) {
        endDate = new Date(formData.deadlineDate);
      } else {
        Swal.fire({
          title: 'Formulir Belum Lengkap!',
          text: 'Harap pilih tanggal batas waktu kampanye.',
          icon: 'warning',
          confirmButtonColor: '#147D73'
        });
        return;
      }
    }

    const hasFile = imageFile !== null;
    const payload = hasFile ? new FormData() : {
      program_name: formData.title.trim(),
      category: formData.category,
      end_date: endDate.toISOString().split('T')[0],
      start_date: startDate.toISOString().split('T')[0],
      target_amount: parseFloat(formData.target.replace(/\./g, '')),
      description: formData.description.trim(),
      recipient_name: formData.recipientName.trim(),
      beneficiary_type: beneficiaryType,
      bank_name: formData.bankName,
      account_number: formData.accountNumber.trim(),
      account_owner: formData.accountOwner.trim(),
      status: 'pending',
      created_by: userId,
      rab_items: rabItems.map(item => ({
        ...item,
        amount: parseFloat(item.amount.toString().replace(/\./g, '')) || 0
      }))
    };

    if (hasFile) {
      payload.append('_method', editData?.program_id ? 'PATCH' : 'POST');
      payload.append('program_name', formData.title.trim());
      payload.append('category', formData.category);
      payload.append('end_date', endDate.toISOString().split('T')[0]);
      payload.append('start_date', startDate.toISOString().split('T')[0]);
      payload.append('target_amount', parseFloat(formData.target.replace(/\./g, '')));
      payload.append('description', formData.description.trim());
      payload.append('recipient_name', formData.recipientName.trim());
      payload.append('beneficiary_type', beneficiaryType);
      payload.append('bank_name', formData.bankName);
      payload.append('account_number', formData.accountNumber.trim());
      payload.append('account_owner', formData.accountOwner.trim());
      payload.append('status', 'pending');
      payload.append('created_by', userId);
      payload.append('image', imageFile);
      rabItems.forEach((item, i) => {
        payload.append(`rab_items[${i}][description]`, item.description);
        payload.append(`rab_items[${i}][amount]`, parseFloat(item.amount.toString().replace(/\./g, '')) || 0);
      });
    }

    const config = hasFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

    try {
      if (editData?.program_id) {
        await (hasFile ? api.post(`/programs/${editData.program_id}`, payload, config) : api.patch(`/programs/${editData.program_id}`, payload));
        await Swal.fire({
          title: 'Perubahan Tersimpan!',
          text: 'Revisi kampanye berhasil disimpan dan masuk ke dalam antrean persetujuan admin!',
          icon: 'success',
          confirmButtonText: 'Kembali ke Dashboard',
          confirmButtonColor: '#147D73'
        });
      } else {
        await api.post('/programs', payload, config);
        await Swal.fire({
          title: 'Pengajuan Berhasil!',
          text: 'Kampanye berhasil diajukan dan masuk ke dalam antrean persetujuan tim admin!',
          icon: 'success',
          confirmButtonText: 'Kembali ke Dashboard',
          confirmButtonColor: '#147D73'
        });
      }

      navigate('/manage-campaign');
    } catch (error) {
      console.error("Error creating campaign:", error);
      Swal.fire({
        title: 'Gagal Menyimpan!',
        text: error.response?.data?.message || 'Terjadi kesalahan saat mengirim data ke server.',
        icon: 'error',
        confirmButtonColor: '#147D73'
      });
    }
  };

  const Topbar = () => (
    <div className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/pavicon.png" alt="Care Fund Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-[#147D73]">
            Care Fund
          </span>
      </div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        BATALKAN
      </button>
    </div>
  );

  const ProgressIndicator = () => {
    const steps = [
      { num: 1, label: 'INFO DASAR' },
      { num: 2, label: 'CERITA & TRANSPARANSI' },
      { num: 3, label: 'VERIFIKASI & KYC' }
    ];

    return (
      <div className="w-full max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#147D73] -z-10 transition-all duration-500"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          ></div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center bg-[#F8FAFA] px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${currentStep > step.num
                  ? 'bg-[#147D73] text-white'
                  : currentStep === step.num
                    ? 'bg-[#147D73] text-white ring-4 ring-[#147D73]/20'
                    : 'bg-gray-200 text-slate-400'
                }`}>
                {currentStep > step.num ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  step.num
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold tracking-wider ${currentStep >= step.num ? 'text-[#147D73]' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAFA] min-h-screen pb-24">
      <Topbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">

        <ProgressIndicator />

        {/* --- HEADER KONTEN --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {currentStep === 1 && "Buat Kampanye Baru - Tahap 1"}
            {currentStep === 2 && "Detail Kampanye & Transparansi - Tahap 2"}
            {currentStep === 3 && "Penerima Manfaat & Verifikasi - Tahap 3"}
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            {currentStep === 1 && "Mulai inisiatif kebaikan Anda dengan melengkapi informasi dasar penggalangan dana. Setiap detail membantu membangun kepercayaan donatur."}
            {currentStep === 2 && "Ceritakan tujuan mulia kampanye Anda dan bagaimana dana akan digunakan. Transparansi membangun kepercayaan donatur."}
            {currentStep === 3 && "Silakan lengkapi data penerima manfaat dan unggah dokumen verifikasi untuk memastikan transparansi kampanye."}
          </p>
        </div>

        {/* --- KOTAK FORMULIR --- */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

          {/* ================= STEP 1: INFO DASAR ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Kampanye</label>
                <input
                  type="text"
                  placeholder="Contoh: Bantu Adik Bayu Melawan Kanker"
                  className="w-full bg-slate-100 text-slate-900 font-medium py-4 px-5 rounded-xl outline-none focus:bg-white focus:border-[#147D73] border border-transparent focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2 min-h-[28px]">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kategori Donasi</label>
                  </div>
                  <select
                    className="w-full bg-slate-100 text-slate-600 font-medium py-4 px-5 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none focus:ring-4 focus:ring-[#147D73]/10 transition-all appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="Sosial">Sosial & Kemanusiaan</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 min-h-[28px]">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Durasi Kampanye</label>
                    <div className="flex bg-slate-200 rounded-lg p-0.5">
                      <button 
                        type="button"
                        onClick={() => setDurationMode('days')} 
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${durationMode === 'days' ? 'bg-white text-[#147D73] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Durasi Hari
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDurationMode('date')} 
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${durationMode === 'date' ? 'bg-white text-[#147D73] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Pilih Tanggal
                      </button>
                    </div>
                  </div>
                  
                  {durationMode === 'days' ? (
                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Contoh: 30"
                        className="w-full bg-slate-100 text-slate-600 font-medium py-4 px-5 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">
                        Tenggat Akhir: <span className="font-bold text-[#147D73]">{formData.durationDays ? getComputedEndDate() : '-'}</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="date"
                        min={today}
                        className="w-full bg-slate-100 text-slate-600 font-medium py-4 px-5 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none focus:ring-4 focus:ring-[#147D73]/10 transition-all cursor-pointer"
                        value={formData.deadlineDate}
                        onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">
                        Total Durasi: <span className="font-bold text-[#147D73]">{formData.deadlineDate ? `${getComputedDuration()} Hari` : '-'}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Dana</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-slate-900 font-bold">Rp</span>
                  </div>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full bg-slate-100 text-slate-900 font-bold py-4 pl-12 pr-5 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                    value={formData.target}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                      setFormData({ ...formData, target: formattedValue });
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Minimal target dana adalah Rp 1.000.000</p>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CERITA & TRANSPARANSI ================= */}
          {currentStep === 2 && (
            <div className="space-y-10">

              <div>
                <div className="border-l-4 border-[#147D73] pl-3 mb-4">
                  <h3 className="font-bold text-slate-900">Visual Kampanye</h3>
                  <p className="text-sm text-slate-500">Gambar yang kuat dapat menyampaikan pesan lebih baik dari ribuan kata.</p>
                </div>
                <label className="border-2 border-dashed border-gray-200 bg-slate-50 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  {imagePreview ? (
                    <div className="w-full flex flex-col items-center">
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl object-contain shadow-md mb-4" />
                      <span className="text-xs font-bold text-[#147D73] px-3 py-1 rounded-full hover:bg-teal-100 transition-colors">Ganti Foto</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="font-bold text-slate-900 mb-1">Unggah Foto Utama</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">Seret dan lepas file Anda di sini, atau klik untuk memilih file. Rekomendasi rasio 16:9, format JPG/PNG, maksimal 5MB.</p>
                    </>
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} />
                </label>
              </div>

              <div>
                <div className="border-l-4 border-[#147D73] pl-3 mb-4">
                  <h3 className="font-bold text-slate-900">Cerita Lengkap</h3>
                  <p className="text-sm text-slate-500">Jelaskan latar belakang, tujuan, dan dampak yang diharapkan.</p>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <textarea
                    rows="8"
                    placeholder="Tuliskan kisah perjuangan yang menginspirasi kampanye ini secara detail..."
                    className="w-full bg-slate-100 text-slate-700 font-medium py-4 px-5 rounded-xl border border-transparent focus:outline-none focus:bg-white focus:border-[#147D73] focus:ring-4 focus:ring-[#147D73]/10 transition-all resize-y"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="border-l-4 border-[#147D73] pl-3 mb-6">
                  <h3 className="font-bold text-slate-900">Rencana Anggaran Biaya (RAB)</h3>
                  <p className="text-sm text-slate-500">Rincikan kebutuhan dana agar donatur mengetahui kemana donasi mereka disalurkan.</p>
                </div>

                <div className="grid grid-cols-12 gap-2 md:gap-4 mb-3 px-2 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-7 md:col-span-8">Deskripsi Kebutuhan</div>
                  <div className="col-span-4 md:col-span-3">Nominal (Rp)</div>
                  <div className="col-span-1 text-center">Aksi</div>
                </div>

                <div className="space-y-3">
                  {rabItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="col-span-7 md:col-span-8">
                        <input
                          type="text"
                          placeholder="Contoh: Biaya Operasional Medis"
                          className="w-full bg-slate-100 text-slate-700 font-medium py-3 px-3 md:px-4 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none"
                          value={item.description}
                          onChange={(e) => handleRabChange(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-3">
                        <input
                          type="text"
                          placeholder="0"
                          className="w-full bg-slate-100 text-slate-700 font-bold py-3 px-3 md:px-4 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none text-right"
                          value={item.amount}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '');
                            const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            handleRabChange(item.id, 'amount', formattedValue);
                          }}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button type="button" onClick={() => handleRemoveRab(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F8FAFA] p-4 rounded-xl border border-gray-100">
                  <button type="button" onClick={handleAddRab} className="flex items-center text-sm font-bold text-[#147D73] hover:text-[#0F655C]">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Tambah Item Anggaran
                  </button>
                  <div className="w-full md:w-auto border-t md:border-none pt-3 md:pt-0 border-gray-200 flex flex-col items-end text-right">
                    <div className={`text-sm font-medium ${totalRabEstimation > (parseFloat(formData.target.replace(/\D/g, '')) || 0) ? 'text-red-600' : 'text-slate-600'}`}>
                      Total Estimasi: <span className={`font-extrabold text-lg ml-2 ${totalRabEstimation > (parseFloat(formData.target.replace(/\D/g, '')) || 0) ? 'text-red-600' : 'text-[#147D73]'}`}>Rp {totalRabEstimation.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                      Maksimal Biaya Diajukan: <span className="font-bold text-slate-600">Rp {formData.target || '0'}</span>
                    </div>
                    {totalRabEstimation > (parseFloat(formData.target.replace(/\D/g, '')) || 0) && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 bg-red-50 px-2 py-1 rounded">Total estimasi melebihi batas maksimal!</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 3: VERIFIKASI & KYC ================= */}
          {currentStep === 3 && (
            <div className="space-y-10">

              {/* Tipe Penerima Manfaat */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Tipe Penerima Manfaat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {[
                    { id: 'diri_sendiri', title: 'Diri Sendiri', desc: 'Kampanye untuk kebutuhan pribadi.' },
                    { id: 'keluarga', title: 'Keluarga', desc: 'Kampanye untuk anggota keluarga.' },
                    { id: 'orang_lain', title: 'Orang Lain', desc: 'Membantu teman atau kerabat.' },
                    { id: 'yayasan', title: 'Yayasan/Lembaga', desc: 'Donasi untuk organisasi resmi.' },
                  ].map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setBeneficiaryType(option.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${beneficiaryType === option.id
                          ? 'bg-[#E8F3F1] border-[#147D73] shadow-sm'
                          : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Custom Radio Button Circle */}
                        <div className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${beneficiaryType === option.id
                            ? 'border-2 border-[#147D73]'
                            : 'border-2 border-gray-300 bg-white'
                          }`}>
                          {beneficiaryType === option.id && (
                            <div className="w-2.5 h-2.5 bg-[#147D73] rounded-full"></div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div>
                          <p className="font-bold text-sm text-slate-900">{option.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* Identitas Penerima */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Identitas Penerima</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap Penerima</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap sesuai KTP/Identitas"
                    className="w-full bg-slate-100 text-slate-900 font-medium py-4 px-5 rounded-xl outline-none focus:bg-white focus:border-[#147D73] border border-transparent focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  />
                </div>
              </div>

              {/* Verifikasi Identitas Fundraiser */}
              <div className="bg-[#F8FAFA] p-6 rounded-2xl border border-[#E8F3F1]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <h3 className="font-bold text-slate-900">Verifikasi Identitas Penggalang Dana</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Kami membutuhkan identitas Anda untuk memastikan keamanan dan mencegah penipuan di platform kami.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-200 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#147D73] transition-colors">
                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    <p className="text-xs font-bold text-[#147D73]">Unggah Foto KTP <span className="text-slate-500 font-normal">(Bypassed)</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#147D73] transition-colors">
                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs font-bold text-[#147D73]">Unggah Foto Selfie dengan KTP <span className="text-slate-500 font-normal">(Bypassed)</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">Pastikan wajah & KTP jelas</p>
                  </div>
                </div>
              </div>

              {/* Rekening Pencairan */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Informasi Rekening Pencairan</h3>
                <p className="text-sm text-slate-500 mb-4">Ke rekening ini dana donasi akan dicairkan setelah kampanye selesai atau mencapai target pencairan.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Bank</label>
                    <select
                      className="w-full bg-slate-100 text-slate-600 font-medium py-4 px-5 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] outline-none focus:ring-4 focus:ring-[#147D73]/10 transition-all appearance-none cursor-pointer"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    >
                      <option value="Bank BCA">Bank BCA</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="Bank BNI">Bank BNI</option>
                      <option value="Bank BRI">Bank BRI</option>
                      <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nomor Rekening</label>
                    <input
                      type="text"
                      maxLength="18"
                      placeholder="Contoh: 1234567890"
                      className="w-full bg-slate-100 text-slate-900 font-medium py-4 px-5 rounded-xl outline-none focus:bg-white focus:border-[#147D73] border border-transparent focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                      value={formData.accountNumber}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, accountNumber: numericValue.slice(0, 18) });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      placeholder="Harus sesuai dengan buku tabungan"
                      className="w-full bg-slate-100 text-slate-900 font-medium py-4 px-5 rounded-xl outline-none focus:bg-white focus:border-[#147D73] border border-transparent focus:ring-4 focus:ring-[#147D73]/10 transition-all"
                      value={formData.accountOwner}
                      onChange={(e) => setFormData({ ...formData, accountOwner: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Dokumen Pendukung */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-slate-900">Dokumen Pendukung</h3>
                  <span className="bg-[#E8F3F1] text-[#147D73] text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">Opsional / Sesuai Kategori</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">Unggah dokumen pendukung medis (rekam medis), surat keterangan tidak mampu (SKTM), atau dokumen legal yayasan untuk memperkuat kampanye Anda.</p>
                <div className="border-2 border-dashed border-gray-200 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <svg className="w-6 h-6 text-[#147D73] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="font-bold text-[#147D73] text-sm">Unggah Dokumen Tambahan (Demo Bypass)</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG up to 10MB (Maks. 5 file)</p>
                </div>
              </div>

            </div>
          )}

          {/* --- BUTTON NAVIGASI BAWAH --- */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center text-slate-500 bg-slate-100 py-3 px-6 rounded-xl hover:bg-slate-200 font-bold transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  // Validasi ringan tiap step
                  if (currentStep === 1 && (!formData.title.trim() || !formData.target)) {
                    Swal.fire({
                      title: 'Form Belum Lengkap',
                      text: 'Silakan isi judul kampanye dan target dana terlebih dahulu.',
                      icon: 'warning',
                      confirmButtonColor: '#147D73'
                    });
                    return;
                  }
                  if (currentStep === 2) {
                    const maxTarget = parseFloat(formData.target.replace(/\D/g, '')) || 0;
                    if (totalRabEstimation > maxTarget) {
                      Swal.fire({
                        title: 'Total RAB Berlebih',
                        text: 'Total estimasi biaya Anda tidak boleh melebihi maksimal target dana yang diajukan.',
                        icon: 'error',
                        confirmButtonColor: '#147D73'
                      });
                      return;
                    }
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 px-8 rounded-xl flex items-center transition-colors shadow-sm"
              >
                Lanjut ke Tahap {currentStep + 1}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3.5 px-8 rounded-xl flex items-center transition-colors shadow-sm"
              >
                {editData ? 'Simpan Revisi' : 'Ajukan Kampanye'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;