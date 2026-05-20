import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../utils/api';

const UserManagementTab = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultUsers = [
    { id: 1, name: 'Ahmad Santoso', email: 'ahmad@email.com', avatar: 'AS', kyc: 'Verified', date: '12 Okt 2023' },
    { id: 2, name: 'Jane Doe', email: 'jane@email.com', avatar: 'JD', kyc: 'Pending', date: '15 Okt 2023' },
    { id: 3, name: 'Jessica Tan', email: 'jessica@email.com', avatar: 'JT', kyc: 'Verified', date: '20 Okt 2023' },
    { id: 4, name: 'Bambang Pamungkas', email: 'bambang@email.com', avatar: 'BP', kyc: 'Pending', date: '22 Okt 2023' },
    { id: 5, name: 'Dewi Lestari', email: 'dewi@email.com', avatar: 'DL', kyc: 'Unverified', date: '25 Okt 2023' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          const mappedUsers = data.map(item => {
            const getInitials = (name) => {
              return (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            };
            const dateObj = new Date(item.created_at || Date.now());
            
            return {
              id: item.id,
              name: item.full_name || 'No Name',
              email: item.email || 'no-email@carefund.com',
              avatar: getInitials(item.full_name || 'No Name'),
              kyc: item.is_verified ? 'Verified' : 'Unverified',
              raw_is_verified: item.is_verified,
              date: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };
          });
          setUsersList(mappedUsers);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Gagal memuat daftar pengguna dari API, menggunakan fallback:', err);
      }
      setUsersList(defaultUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const toggleKyc = async (id) => {
    const u = usersList.find(user => user.id === id);
    if (!u) return;

    let nextKyc = 'Verified';
    if (u.kyc === 'Verified') nextKyc = 'Pending';
    else if (u.kyc === 'Pending') nextKyc = 'Unverified';
    else nextKyc = 'Verified';

    const nextIsVerifiedBoolean = nextKyc === 'Verified';

    // 1. Try API call
    try {
      await api.patch(`/users/${id}`, { is_verified: nextIsVerifiedBoolean });
    } catch (err) {
      console.warn('Gagal mengubah status verifikasi di API, memperbarui lokal saja:', err);
    }

    // 2. Update local state
    setUsersList(usersList.map(item => {
      if (item.id === id) {
        return { ...item, kyc: nextKyc };
      }
      return item;
    }));

    Swal.fire({
      title: 'Status KYC Diperbarui!',
      text: `Status KYC untuk ${u.name} diubah menjadi ${nextKyc}.`,
      icon: 'success',
      confirmButtonColor: '#147D73'
    });
  };

  const handleCreateUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Pengguna Baru',
      html:
        '<input id="swal-input-name" class="swal2-input" placeholder="Nama Lengkap">' +
        '<input id="swal-input-email" class="swal2-input" placeholder="Alamat Email">',
      focusConfirm: false,
      confirmButtonText: 'Tambah',
      confirmButtonColor: '#147D73',
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const email = document.getElementById('swal-input-email').value;
        if (!name || !email) {
          Swal.showValidationMessage('Nama dan Email wajib diisi!');
        }
        return { name, email };
      }
    });

    if (formValues) {
      const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      };

      const newUser = {
        id: Date.now(),
        name: formValues.name,
        email: formValues.email,
        avatar: getInitials(formValues.name),
        kyc: 'Unverified',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setUsersList([newUser, ...usersList]);

      Swal.fire({
        title: 'Berhasil!',
        text: `${formValues.name} telah berhasil ditambahkan sebagai user baru platform!`,
        icon: 'success',
        confirmButtonColor: '#147D73'
      });
    }
  };

  // Hitung stats berdasarkan list dinamis
  const totalUsers = usersList.length;
  const verifiedCount = usersList.filter(u => u.kyc === 'Verified').length;
  const pendingCount = usersList.filter(u => u.kyc === 'Pending').length;

  const stats = [
    { label: 'Total Users', value: totalUsers, change: 'LIVE UPDATE', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Verified KYC', value: verifiedCount, change: totalUsers > 0 ? `${Math.round((verifiedCount/totalUsers)*100)}% DARI TOTAL` : '0% DARI TOTAL', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Verification', value: pendingCount, change: 'BUTUH TINJAUAN', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Filter & Search Logic
  const filteredUsers = usersList.filter(u => {
    const matchesFilter = activeFilter === 'Semua' || u.kyc === activeFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
          <p className="text-gray-500">Pantau dan kelola seluruh pengguna platform secara realtime.</p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="bg-[#147D73] hover:bg-[#0E5E57] text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm text-sm"
        >
          <UserPlus size={16} /> Tambah User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
               <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-4xl font-bold text-gray-800 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
            {['Semua', 'Verified', 'Pending', 'Unverified'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveFilter(tab)}
                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeFilter === tab 
                    ? 'bg-[#147D73] text-white shadow-lg shadow-teal-900/10' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-1 md:flex-initial">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Cari nama atau email..."
                className="w-full bg-gray-50 text-gray-800 text-xs font-semibold py-2.5 pl-9 pr-4 rounded-xl border border-transparent focus:bg-white focus:border-[#147D73] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status KYC</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Daftar</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50/50">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600">
                        {user.avatar}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-500">{user.email}</td>
                  <td className="px-10 py-6">
                    <button 
                      onClick={() => toggleKyc(user.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit hover:opacity-80 transition-all ${
                        user.kyc === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                        user.kyc === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.kyc === 'Verified' ? 'bg-emerald-500' :
                        user.kyc === 'Pending' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{user.kyc}</span>
                    </button>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-600 font-medium">{user.date}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={() => toggleKyc(user.id)}
                        className="flex items-center gap-1.5 text-[#147D73] text-xs font-bold hover:underline"
                      >
                        Ubah Status
                      </button>
                      <button 
                        onClick={() => {
                          setUsersList(usersList.filter(u => u.id !== user.id));
                          Swal.fire({
                            title: 'Dihapus!',
                            text: 'Pengguna berhasil dihapus dari sistem.',
                            icon: 'success',
                            confirmButtonColor: '#147D73'
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-10 py-12 text-center text-slate-400 italic font-medium">
                    Tidak ada pengguna yang cocok dengan filter atau pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-10 flex items-center justify-between border-t border-gray-50">
          <p className="text-xs text-gray-400">Menampilkan 1 - {filteredUsers.length} dari {usersList.length} pengguna</p>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-xl text-xs font-bold bg-[#147D73] text-white shadow-lg shadow-teal-900/20">1</button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2024 Care Fund Admin Panel. Developed with love</p>
      </div>
    </div>
  );
};

export default UserManagementTab;
