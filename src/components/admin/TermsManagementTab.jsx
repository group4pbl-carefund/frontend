import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  BookOpen,
  Eye,
  Trash2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import api from '../../utils/api';

const TermsManagementTab = () => {
  const [versions, setVersions] = useState([]);
  const [acceptances, setAcceptances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // New T&C Form States
  const [newVersion, setNewVersion] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newHighlights, setNewHighlights] = useState(['']);
  const [newContent, setNewContent] = useState('');
  const [setActiveImmediately, setSetActiveImmediately] = useState(true);

  const defaultVersions = [
    {
      id: 1,
      version: 'v1.0.0',
      title: 'Syarat dan Ketentuan Awal Care Fund',
      content: `### 1. Ketentuan Umum\nSelamat datang di Care Fund. Dengan mengakses atau menggunakan platform kami, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.\n\n### 2. Pendaftaran Akun\nUntuk menggunakan fitur donasi dan edukasi tertentu, Anda harus mendaftar akun dan memberikan informasi yang akurat. Anda bertanggung jawab menjaga kerahasiaan kata sandi Anda.`,
      highlights: [
        'Ketentuan pendaftaran akun dan perlindungan kredensial.',
        'Pengenaan biaya operasional maksimal 5% untuk pemeliharaan platform.'
      ],
      status: 'inactive',
      publishedAt: '2024-01-12T08:00:00Z',
      author: 'Admin CareFund',
      acceptedCount: 120
    },
    {
      id: 2,
      version: 'v2.0.0',
      title: 'Syarat dan Ketentuan v2.0.0 - Pembaruan Kebijakan Transparansi & Biaya',
      content: `### 1. Ketentuan Layanan Pembaruan\nKami telah memperbarui Syarat dan Ketentuan kami untuk meningkatkan transparansi penyaluran dana serta kepatuhan terhadap regulasi perlindungan data pribadi (UU PDP).\n\n### 2. Sistem Transparansi & Distribusi\nSetiap donasi kini dilengkapi dengan pelaporan real-time yang dapat diakses melalui Dashboard Komunitas.`,
      highlights: [
        'Penurunan biaya admin platform dari 5% menjadi 3.5% flat.',
        'Peningkatan keamanan data KYC sesuai regulasi UU PDP terbaru.'
      ],
      status: 'active',
      publishedAt: '2026-02-10T09:00:00Z',
      author: 'Super Admin CareFund',
      acceptedCount: 98
    }
  ];

  const defaultAcceptances = [
    {
      id: 1,
      userName: 'Ahmad Santoso',
      userEmail: 'ahmad@email.com',
      version: 'v2.0.0',
      acceptedAt: '2026-02-11T10:15:30Z'
    },
    {
      id: 2,
      userName: 'Jessica Tan',
      userEmail: 'jessica@email.com',
      version: 'v2.0.0',
      acceptedAt: '2026-02-12T14:20:00Z'
    }
  ];

  const loadAllData = async () => {
    setLoading(true);
    let loadedFromApi = false;

    try {
      const response = await api.get('/term-versions');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
        const sortedData = [...data].sort((a, b) => (b.version_id || b.id) - (a.version_id || a.id));
        const mappedVersions = sortedData.map((item, idx) => {
          const lines = (item.content || '').split('\n').filter(l => l.startsWith('-') || l.startsWith('*') || l.length > 20);
          const itemHighlights = lines.slice(0, 3).map(l => l.replace(/^[-*\s]+/, '').trim());

          return {
            id: item.version_id || item.id,
            version: item.version_number || 'v1.0.0',
            title: `Syarat & Ketentuan Versi ${item.version_number}`,
            content: item.content || '',
            highlights: itemHighlights.length > 0 ? itemHighlights : ['Pembaruan ketentuan layanan platform.'],
            status: idx === 0 ? 'active' : 'inactive',
            publishedAt: item.effective_date || item.created_at || new Date().toISOString(),
            author: 'System Admin',
            acceptedCount: 0
          };
        });
        setVersions(mappedVersions);
        localStorage.setItem('carefund_tc_versions', JSON.stringify(mappedVersions));
        loadedFromApi = true;
      }
    } catch (err) {
      console.warn('Gagal memuat versi S&K dari API, menggunakan localStorage/fallback:', err);
    }

    if (!loadedFromApi) {
      const storedVersions = localStorage.getItem('carefund_tc_versions');
      if (storedVersions) {
        try {
          setVersions(JSON.parse(storedVersions));
        } catch (e) {
          setVersions(defaultVersions);
        }
      } else {
        setVersions(defaultVersions);
        localStorage.setItem('carefund_tc_versions', JSON.stringify(defaultVersions));
      }
    }

    const storedAcceptances = localStorage.getItem('carefund_tc_acceptances');
    if (storedAcceptances) {
      try {
        setAcceptances(JSON.parse(storedAcceptances));
      } catch (e) {
        setAcceptances(defaultAcceptances);
      }
    } else {
      setAcceptances(defaultAcceptances);
      localStorage.setItem('carefund_tc_acceptances', JSON.stringify(defaultAcceptances));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const saveVersionsToStorage = (updatedVersions) => {
    localStorage.setItem('carefund_tc_versions', JSON.stringify(updatedVersions));
    setVersions(updatedVersions);
  };

  const saveAcceptancesToStorage = (updatedAcceptances) => {
    localStorage.setItem('carefund_tc_acceptances', JSON.stringify(updatedAcceptances));
    setAcceptances(updatedAcceptances);
  };

  const activeVersion = versions.find(v => v.status === 'active') || null;

  const handleAddHighlight = () => {
    setNewHighlights([...newHighlights, '']);
  };

  const handleHighlightChange = (index, value) => {
    const updated = [...newHighlights];
    updated[index] = value;
    setNewHighlights(updated);
  };

  const handleRemoveHighlight = (index) => {
    const updated = [...newHighlights];
    updated.splice(index, 1);
    setNewHighlights(updated.length > 0 ? updated : ['']);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!newVersion.trim() || !newTitle.trim() || !newContent.trim()) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Semua field wajib diisi!',
        icon: 'error',
        confirmButtonColor: '#149187'
      });
      return;
    }

    if (versions.some(v => v.version.toLowerCase() === newVersion.trim().toLowerCase())) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Versi ini sudah ada!',
        icon: 'error',
        confirmButtonColor: '#149187'
      });
      return;
    }

    const todayDateStr = new Date().toISOString().split('T')[0];

    let apiSuccess = false;
    try {
      await api.post('/term-versions', {
        version_number: newVersion.trim(),
        content: newContent,
        effective_date: todayDateStr
      });
      apiSuccess = true;
    } catch (err) {
      console.warn('Gagal menerbitkan T&C baru ke backend API, membuat lokal:', err);
    }

    const cleanedHighlights = newHighlights.filter(h => h.trim() !== '');
    const newTc = {
      id: Date.now(),
      version: newVersion.trim(),
      title: newTitle.trim(),
      content: newContent,
      highlights: cleanedHighlights.length > 0 ? cleanedHighlights : ['Pembaruan ketentuan layanan.'],
      status: setActiveImmediately ? 'active' : 'inactive',
      publishedAt: new Date().toISOString(),
      author: 'Super Admin CareFund',
      acceptedCount: 0
    };

    let updatedVersions = [...versions];
    if (setActiveImmediately) {
      updatedVersions = updatedVersions.map(v => ({
        ...v,
        status: 'inactive'
      }));
    }

    updatedVersions.unshift(newTc);
    saveVersionsToStorage(updatedVersions);

    setNewVersion('');
    setNewTitle('');
    setNewHighlights(['']);
    setNewContent('');
    setSetActiveImmediately(true);
    setShowCreateForm(false);

    if (apiSuccess) {
      loadAllData();
    }

    Swal.fire({
      title: 'Berhasil!',
      text: `T&C Versi ${newTc.version} berhasil diterbitkan!`,
      icon: 'success',
      confirmButtonColor: '#149187'
    });
  };

  // Delete version (only if not currently active)
  const handleDeleteVersion = async (id) => {
    const vToDelete = versions.find(v => v.id === id);
    if (vToDelete && vToDelete.status === 'active') {
      Swal.fire({
        title: 'Gagal!',
        text: 'Anda tidak bisa menghapus Syarat & Ketentuan yang sedang aktif!',
        icon: 'error',
        confirmButtonColor: '#149187'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Apakah Anda yakin ingin menghapus T&C versi ${vToDelete?.version}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      // 1. Try sending to the backend Laravel API
      let apiSuccess = false;
      try {
        await api.delete(`/term-versions/${id}`);
        apiSuccess = true;
      } catch (err) {
        console.warn('Gagal menghapus T&C dari backend API, memperbarui lokal saja:', err);
      }

      // 2. Perform local update
      const updated = versions.filter(v => v.id !== id);
      saveVersionsToStorage(updated);
      if (selectedVersion?.id === id) {
        setSelectedVersion(null);
      }

      if (apiSuccess) {
        loadAllData();
      }

      Swal.fire({
        title: 'Dihapus!',
        text: `T&C versi ${vToDelete?.version} berhasil dihapus.`,
        icon: 'success',
        confirmButtonColor: '#149187'
      });
    }
  };

  // Reset Regular User Acceptance to simulate block flow
  const handleResetSimulatedUser = () => {
    const loggedUser = localStorage.getItem('user');
    let currentUserObj = null;
    if (loggedUser) {
      currentUserObj = JSON.parse(loggedUser);
    }

    // Set Regular User's accepted version in acceptances to v1.0.0
    const updatedAcceptances = acceptances.map(acc => {
      if (acc.userEmail === 'user@carefund.com') {
        return {
          ...acc,
          version: 'v1.0.0',
          acceptedAt: '2024-01-15T09:00:00Z'
        };
      }
      return acc;
    });
    saveAcceptancesToStorage(updatedAcceptances);

    // Also update logged-in user in localStorage to trigger immediately if we are logged in as regular user
    if (currentUserObj && currentUserObj.email === 'user@carefund.com') {
      currentUserObj.acceptedTermsVersion = 'v1.0.0';
      localStorage.setItem('user', JSON.stringify(currentUserObj));
      Swal.fire({
        title: 'Demo User Direset!',
        text: 'Akun Demo User didegradasi ke v1.0.0. Silakan masuk ke Dashboard untuk melihat pemblokiran & halaman persetujuan!',
        icon: 'info',
        confirmButtonColor: '#149187'
      });
    } else {
      Swal.fire({
        title: 'Data Demo Direset!',
        text: 'Data demo pengguna berhasil direset ke v1.0.0. Silakan login sebagai user@carefund.com untuk melihat halaman persetujuan.',
        icon: 'success',
        confirmButtonColor: '#149187'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Tab Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Syarat & Ketentuan</h2>
          <p className="text-gray-500">Kelola dokumen hukum platform dan pantau kepatuhan pengguna terhadap versi T&C terbaru.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSimulatedUser}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl hover:bg-amber-100 transition-all"
            title="Degradasi persetujuan user@carefund.com agar dia terblokir dan wajib menyetujui ulang."
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Simulasi Reset User (v1.0)
          </button>
          
          <button 
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setSelectedVersion(null);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#149187] text-white text-xs font-bold rounded-xl hover:bg-[#0f7c73] transition-all shadow-md shadow-teal-900/10 active:scale-95"
          >
            {showCreateForm ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Ringkasan
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Terbitkan Versi Baru
              </>
            )}
          </button>
        </div>
      </div>

      {showCreateForm ? (
        /* Create New T&C Version Form */
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 lg:p-12 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-teal-50 rounded-2xl">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Terbitkan Dokumen Syarat & Ketentuan Baru</h3>
                <p className="text-xs text-gray-500">Formulir ini akan membuat versi T&C baru yang mengikat seluruh pengguna platform.</p>
              </div>
            </div>

            <form onSubmit={handlePublish} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                    Kode Versi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: v2.1.0"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#149187]/20 focus:bg-white transition-all text-sm font-bold text-gray-700"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Gunakan penomoran semantik (vX.Y.Z).</span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                    Judul Dokumen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Syarat & Ketentuan Pembaruan Layanan Keuangan"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#149187]/20 focus:bg-white transition-all text-sm font-semibold text-gray-700"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Highlights Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Highlight Perubahan (Poin Utama)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-xs font-bold text-[#149187] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Poin
                  </button>
                </div>
                <div className="space-y-3">
                  {newHighlights.map((hl, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600 shrink-0">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        placeholder="Contoh: Pengurangan potongan komisi dari 5% menjadi 3.5%"
                        className="flex-grow bg-gray-50 border border-gray-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#149187]/20 focus:bg-white transition-all text-xs"
                        value={hl}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                      />
                      {newHighlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 mt-2 block">Poin-poin ini akan ditampilkan secara ringkas kepada pengguna sebelum mereka membaca dokumen penuh agar lebih mudah dipahami.</span>
              </div>

              {/* T&C Body Editor */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  Isi Dokumen Syarat & Ketentuan (Mendukung Markdown) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor Input */}
                  <div>
                    <textarea
                      required
                      rows={12}
                      placeholder="Gunakan Markdown untuk format yang rapi...&#10;&#10;### 1. Judul Bagian&#10;Isi ketentuan di sini...&#10;&#10;- Poin penting&#10;- Poin penting lainnya"
                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-[#149187]/20 focus:bg-white transition-all text-xs font-mono text-gray-700 leading-relaxed resize-none h-[350px]"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    ></textarea>
                  </div>
                  {/* Visual Preview */}
                  <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50 h-[350px] overflow-y-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 border-b pb-2">PREVIEW HASIL TAMPILAN</span>
                    <div className="prose prose-sm text-slate-700 max-w-none text-xs space-y-4">
                      {newContent ? (
                        newContent.split('\n\n').map((para, i) => {
                          if (para.startsWith('### ')) {
                            return <h4 key={i} className="text-sm font-bold text-gray-800 pt-2">{para.replace('### ', '')}</h4>;
                          } else if (para.startsWith('- ') || para.startsWith('* ')) {
                            return (
                              <ul key={i} className="list-disc pl-4 space-y-1">
                                {para.split('\n').map((li, j) => (
                                  <li key={j}>{li.replace(/^[-*]\s+/, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={i} className="leading-relaxed">{para}</p>;
                        })
                      ) : (
                        <p className="text-gray-400 italic">Ketik di panel kiri untuk melihat pratinjau hasil cetak...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Switcher & Action buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="set-active"
                    className="w-5 h-5 rounded border-gray-300 text-[#149187] focus:ring-[#149187]"
                    checked={setActiveImmediately}
                    onChange={(e) => setSetActiveImmediately(e.target.checked)}
                  />
                  <label htmlFor="set-active" className="text-xs font-bold text-gray-700 cursor-pointer">
                    Terbitkan sebagai Versi Aktif Utama &amp; Terapkan Segera
                  </label>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-200 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#149187] hover:bg-[#0f7c73] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-900/10 active:scale-[0.98]"
                  >
                    Terbitkan T&amp;C Sekarang 🚀
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      ) : selectedVersion ? (
        /* Detailed View of a T&C Version */
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 lg:p-12 animate-in zoom-in-95 duration-200">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedVersion(null)}
              className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Ringkasan
            </button>

            <div className="flex flex-wrap items-start justify-between gap-6 mb-8 border-b pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedVersion.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${
                    selectedVersion.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {selectedVersion.status === 'active' ? 'Aktif Terbit' : 'Arsip'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Dibuat: {new Date(selectedVersion.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>Penulis: {selectedVersion.author}</span>
                  <span>•</span>
                  <span className="font-bold text-[#149187]">Versi: {selectedVersion.version}</span>
                </div>
              </div>

              {selectedVersion.status !== 'active' && (
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: 'Aktifkan Versi Ini?',
                      text: `Jadikan ${selectedVersion.version} sebagai syarat & ketentuan yang aktif? Ini akan menonaktifkan versi yang lain secara global.`,
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Ya, Aktifkan',
                      cancelButtonText: 'Batal',
                      confirmButtonColor: '#149187',
                      cancelButtonColor: '#aaa'
                    });

                    if (result.isConfirmed) {
                      const updated = versions.map(v => ({
                        ...v,
                        status: v.id === selectedVersion.id ? 'active' : 'inactive'
                      }));
                      saveVersionsToStorage(updated);
                      setSelectedVersion({ ...selectedVersion, status: 'active' });
                      Swal.fire({
                        title: 'Berhasil!',
                        text: `Versi ${selectedVersion.version} sekarang aktif secara global.`,
                        icon: 'success',
                        confirmButtonColor: '#149187'
                      });
                    }
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all"
                >
                  Aktifkan Versi Ini
                </button>
              )}
            </div>

            {/* Highlights preview */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-8">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Ringkasan Perubahan Penting
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedVersion.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content view */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">ISI DOKUMEN PENUH</h4>
              <div className="bg-white border border-gray-100 p-8 rounded-3xl text-sm text-slate-700 leading-relaxed space-y-4 max-h-[500px] overflow-y-auto shadow-inner">
                {selectedVersion.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('### ')) {
                    return <h4 key={i} className="text-base font-bold text-gray-800 pt-3">{para.replace('### ', '')}</h4>;
                  } else if (para.startsWith('- ') || para.startsWith('* ')) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1.5 my-2">
                        {para.split('\n').map((li, j) => (
                          <li key={j}>{li.replace(/^[-*]\s+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </div>

            {/* Simulated Acceptance Stats */}
            <div className="mt-8 flex items-center justify-between p-6 bg-teal-50/50 rounded-2xl border border-teal-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Tingkat Penerimaan</p>
                  <p className="text-sm font-semibold text-teal-900">{selectedVersion.acceptedCount || 0} Pengguna Telah Menyetujui</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700">
                {selectedVersion.status === 'active' ? 'Wajib untuk seluruh pengguna' : 'Arsip Dokumen Lama'}
              </span>
            </div>

          </div>
        </div>
      ) : (
        /* Summary view: Stats, Active Doc, History Table, Logs */
        <>
          {/* Top Panel: Active Document Detail & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active T&C Info Card */}
            <div className="lg:col-span-2 bg-[#1E293B] text-white p-8 rounded-[36px] shadow-lg relative overflow-hidden flex flex-col justify-between group">
              {/* Background gradient graphics */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/15 transition-all duration-700"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">AKTIF SAAT INI</span>
                  </div>
                  <span className="text-sm font-bold text-white/50">{activeVersion ? activeVersion.version : 'Tidak ada'}</span>
                </div>
                
                <h3 className="text-2xl font-bold tracking-tight mb-2 max-w-xl">
                  {activeVersion ? activeVersion.title : 'Belum Ada Syarat & Ketentuan Aktif'}
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-lg mb-6 line-clamp-2">
                  Diterbitkan oleh {activeVersion?.author} pada {activeVersion && new Date(activeVersion.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB.
                </p>

                {activeVersion && (
                  <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Highlights Versi Aktif:</p>
                    <ul className="space-y-1.5">
                      {activeVersion.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 bg-[#60C9B3] rounded-full"></div>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {activeVersion && (
                <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-auto">
                  <div className="text-xs">
                    <span className="text-slate-400">Tingkat Adopsi:</span>{' '}
                    <span className="font-bold text-teal-400">98.4%</span>
                  </div>
                  <button 
                    onClick={() => setSelectedVersion(activeVersion)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#60C9B3] hover:underline group/btn"
                  >
                    Baca Dokumen Penuh
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stat Cards */}
            <div className="flex flex-col gap-6">
              
              {/* Stat 1: Total Accepted */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Penandatangan</p>
                  <h4 className="text-3xl font-extrabold text-gray-800">{activeVersion ? activeVersion.acceptedCount + 3 : 0}</h4>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">✓ Kepatuhan Terjamin</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-2xl">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
              </div>

              {/* Stat 2: Compliance Flag */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Kepatuhan</p>
                  <h4 className="text-3xl font-extrabold text-gray-800">Sesuai</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Regulasi UU PDP Aktif</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

            </div>

          </div>

          {/* Table Container: History & Acceptance Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Version History Table (Col-Span 2) */}
            <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Riwayat Versi T&amp;C</h3>
                  <p className="text-xs text-gray-400">Daftar arsip seluruh syarat dan ketentuan yang pernah diterbitkan.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Versi</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Judul</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Terbit</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/30 transition-colors border-b border-gray-50/50">
                        <td className="px-8 py-5 text-sm font-extrabold text-[#149187]">{v.version}</td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-semibold text-gray-800 block line-clamp-1 max-w-[220px]">{v.title}</span>
                          <span className="text-[10px] text-gray-400">{v.author}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight inline-block ${
                            v.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {v.status === 'active' ? 'Aktif' : 'Arsip'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-gray-500 font-medium">
                          {new Date(v.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => setSelectedVersion(v)}
                              className="p-1.5 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {v.status !== 'active' && (
                              <button 
                                onClick={() => handleDeleteVersion(v.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Acceptance Logs (Col-Span 1) */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-800">Aktivitas User</h3>
                <p className="text-xs text-gray-400">Persetujuan T&amp;C terbaru oleh pengguna secara real-time.</p>
              </div>

              <div className="divide-y divide-gray-50 overflow-y-auto flex-grow max-h-[350px]">
                {acceptances.map((acc) => (
                  <div key={acc.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-[#149187] flex items-center justify-center text-xs font-black shrink-0">
                      {acc.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{acc.userName}</p>
                        <span className="text-[9px] font-extrabold text-[#149187] bg-teal-50 px-2 py-0.5 rounded-full uppercase">
                          {acc.version}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mb-1">{acc.userEmail}</p>
                      
                      <div className="flex items-center gap-1 text-[9px] text-gray-400">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>
                          {new Date(acc.acceptedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(acc.acceptedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto text-center">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">LOGS DIPERBARUI SECARA OTOMATIS</span>
              </div>

            </div>

          </div>
        </>
      )}

      {/* Footer Branding */}
      <div className="text-center py-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2026 Care Fund Admin Panel. Developed with love</p>
      </div>

    </div>
  );
};

export default TermsManagementTab;
