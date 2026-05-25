import React, { useState } from 'react';
import { Users, Calendar, Plus, ChevronRight, Share2, MessageSquare, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainLayout';
import api from '../../utils/api';

const ManageCampaignPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user && user.id) {
      api.get(`/program-campaigns?user_id=${user.id}`)
        .then(res => {
          const data = res.data?.data || res.data;
          if (Array.isArray(data)) {
            setCampaigns(data);
            if (data.length > 0) {
              setActiveCampaign(data[0]);
            }
          }
        })
        .catch(err => console.error("Error fetching campaigns:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleExtendDays = async () => {
    if (!activeCampaign) return;

    const result = await Swal.fire({
      title: 'Perpanjang Durasi',
      text: 'Apakah Anda yakin ingin menambahkan 7 hari ke durasi penggalangan dana?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Perpanjang',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#147D73',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      try {
        const res = await api.post(`/program-campaigns/${activeCampaign.campaign_id}/extend`);
        const updatedCampaign = res.data?.data || res.data;
        
        setCampaigns(campaigns.map(c => c.campaign_id === activeCampaign.campaign_id ? updatedCampaign : c));
        setActiveCampaign(updatedCampaign);

        Swal.fire({
          title: 'Berhasil!',
          text: `Durasi kampanye berhasil diperpanjang.`,
          icon: 'success',
          confirmButtonColor: '#147D73'
        });
      } catch (err) {
        console.error("Error extending campaign:", err);
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperpanjang durasi.',
          icon: 'error',
          confirmButtonColor: '#147D73'
        });
      }
    }
  };

  const handleCreateUpdate = async () => {
    if (!activeCampaign) return;

    const { value: text } = await Swal.fire({
      title: 'Buat Kabar Terbaru',
      input: 'textarea',
      inputLabel: 'Laporkan perkembangan kondisi penerima manfaat atau transparansi penggunaan dana kepada donatur.',
      inputPlaceholder: 'Tulis laporan kabar terbaru di sini...',
      showCancelButton: true,
      confirmButtonText: 'Terbitkan Laporan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#147D73',
      cancelButtonColor: '#aaa',
      inputValidator: (value) => {
        if (!value) {
          return 'Isi laporan tidak boleh kosong!';
        }
      }
    });

    if (text) {
      try {
        const payload = {
          distribution_id: activeCampaign.program_id,
          title: 'Update Laporan',
          content: text,
          notes: text,
          status: 'published',
          updated_by: user.id
        };
        await api.post('/distribution-updates', payload);

        const newUpdate = {
          id: Date.now(),
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          text: text
        };
        
        const updatedActive = {
          ...activeCampaign,
          updates: activeCampaign.updates ? [newUpdate, ...activeCampaign.updates] : [newUpdate]
        };
        
        setCampaigns(campaigns.map(c => c.campaign_id === activeCampaign.campaign_id ? updatedActive : c));
        setActiveCampaign(updatedActive);

        Swal.fire({
          title: 'Berhasil Diterbitkan!',
          text: 'Laporan kabar terbaru Anda telah berhasil dikirimkan.',
          icon: 'success',
          confirmButtonColor: '#147D73'
        });
      } catch (err) {
        console.error("Error creating update:", err);
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menerbitkan laporan.',
          icon: 'error',
          confirmButtonColor: '#147D73'
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 bg-[#F4F7F6] min-h-screen flex items-center justify-center">
          <p className="text-slate-500 font-bold italic">Memuat data kampanye...</p>
        </div>
      </MainLayout>
    );
  }

  if (!activeCampaign) {
    return (
      <MainLayout>
        <div className="p-10 bg-[#F4F7F6] min-h-screen flex flex-col items-center justify-center">
          <p className="text-slate-500 font-bold italic mb-4">Tidak ada kampanye aktif untuk dikelola saat ini.</p>
          <button onClick={() => navigate('/user-profile')} className="text-[#147D73] font-bold underline">Kembali ke Profil</button>
        </div>
      </MainLayout>
    );
  }

  const collected = activeCampaign.current_amount || activeCampaign.collected || 0;
  const target = activeCampaign.program?.target_amount || activeCampaign.target || 1;
  const progressPercentage = Math.min(100, Math.round((collected / target) * 100));

  const daysLeft = activeCampaign.program?.end_date ? 
    Math.max(0, Math.ceil((new Date(activeCampaign.program.end_date) - new Date()) / (1000 * 60 * 60 * 24))) 
    : (activeCampaign.daysLeft || 0);

  return (
    <MainLayout>
      <div className="p-10 bg-[#F4F7F6] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10 max-w-6xl mx-auto">
        <div>
          <button onClick={() => navigate('/user-profile')} className="flex items-center text-sm font-bold text-[#147D73] hover:opacity-70 transition-opacity mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Profil
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kelola Kampanye</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Pantau perkembangan, anggaran, dan transparansi dana Anda.</p>
        </div>
        <button 
          onClick={() => {
            Swal.fire({
              title: 'Bagikan Kampanye!',
              text: `Link kampanye "${activeCampaign.title}" telah disalin ke clipboard Anda!`,
              icon: 'success',
              confirmButtonColor: '#147D73'
            });
          }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Share2 size={18} /> Bagikan
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* DETAIL RINGKASAN */}
        <div className="mb-6 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black bg-[#E8F3F1] text-[#147D73] px-3 py-1 rounded-full uppercase tracking-widest">
            {activeCampaign.program?.category || activeCampaign.category || 'UMUM'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">{activeCampaign.program?.program_name || activeCampaign.title}</h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Oleh: {activeCampaign.user || user?.name || 'Anda'}</p>
        </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
        {/* Total Donatur */}
        <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4"><Users size={24}/></div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Total Donatur</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{(activeCampaign.donor_count || activeCampaign.donorsCount || 0).toLocaleString('id-ID')} <span className="text-sm font-medium">Orang</span></h2>
          <button className="mt-4 text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">Lihat Semua Donatur <ChevronRight size={14}/></button>
        </div>

        {/* Sisa Waktu & Extend */}
        <div className="p-8 bg-teal-50 rounded-[2.5rem] border border-teal-100">
          <div className="bg-[#147D73] w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4"><Calendar size={24}/></div>
          <p className="text-xs font-black text-teal-400 uppercase tracking-widest">Sisa Waktu</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-slate-900 mt-1">{daysLeft} <span className="text-sm font-medium">Hari</span></h2>
            <button onClick={handleExtendDays} className="mb-1 text-[#147D73] hover:scale-110 transition-all"><Plus size={20}/></button>
          </div>
          <p className="text-[10px] text-[#147D73] font-bold mt-2 uppercase underline cursor-pointer" onClick={handleExtendDays}>Perpanjang Durasi (Extend)</p>
        </div>

        {/* Persentase Dana */}
        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Pencapaian Dana</p>
          <h2 className="text-4xl font-black text-teal-400 italic">{progressPercentage}%</h2>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-teal-500 h-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-wide">
            Terkumpul: Rp {collected.toLocaleString('id-ID')} / Target Rp {target.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* UPDATE SECTION */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center mb-10 max-w-6xl mx-auto gap-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">Update Kabar Terbaru</h3>
          <p className="text-slate-400 text-sm mt-1">Berikan laporan penggunaan dana agar donatur tetap percaya.</p>
        </div>
        <button 
          onClick={handleCreateUpdate}
          className="bg-[#147D73] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#0e5e57] transition-all shadow-xl shadow-teal-900/10"
        >
          Buat Laporan
        </button>
      </div>

      {/* DAFTAR LAPORAN YANG SUDAH DITERBITKAN */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare size={24} className="text-[#147D73]" /> Laporan Kabar Terbaru ({activeCampaign.updates?.length || 0})
        </h3>
        <div className="space-y-4">
          {activeCampaign.updates && activeCampaign.updates.length > 0 ? (
            activeCampaign.updates.map((upd) => (
              <div key={upd.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 mb-2">{upd.date}</p>
                <p className="text-slate-700 font-medium leading-relaxed">{upd.text}</p>
              </div>
            ))
          ) : (
            <div className="border-2 border-dashed border-slate-200 p-8 rounded-3xl text-center text-slate-400 font-medium italic bg-white">
              Belum ada laporan perkembangan yang diterbitkan untuk kampanye ini.
            </div>
          )}
        </div>
      </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default ManageCampaignPage;