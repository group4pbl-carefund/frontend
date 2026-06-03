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
import { formatDate } from '../../utils/format';

const UserManagementTab = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
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
            kyc: item.is_verified ? 'Verified' : 'Pending',
            raw_is_verified: item.is_verified,
            date: formatDate(dateObj, 'short'),
            raw_user: item
          };
        });
        setUsersList(mappedUsers);
      }
    } catch (err) {
      console.error('Gagal memuat daftar pengguna dari API:', err);
      setUsersList([]);
    }
    setLoading(false);
  };

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.raw_user.full_name || '',
      date_of_birth: user.raw_user.date_of_birth || '',
      role: user.raw_user.role || 'user',
      gender: user.raw_user.gender || '',
      phone: user.raw_user.phone || '',
      address: user.raw_user.address || ''
    });
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    try {
      await api.patch(`/users/${selectedUser.id}`, editForm);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pengguna berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#147D73'
      });
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      Swal.fire('Gagal!', 'Tidak dapat memperbarui data.', 'error');
    }
  };

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
      const newUserPayload = {
        full_name: formValues.name,
        email: formValues.email,
        password: 'password123', // Default password for admin-created users
        password_confirmation: 'password123',
        is_verified: false
      };

      try {
        await api.post('/users', newUserPayload);
        
        // Refresh data from API
        const response = await api.get('/users');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          const mappedUsers = data.map(item => {
            const getInitials = (name) => (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            return {
              id: item.id,
              name: item.full_name || 'No Name',
              email: item.email || 'no-email@carefund.com',
              avatar: getInitials(item.full_name || 'No Name'),
              kyc: item.is_verified ? 'Verified' : 'Unverified',
              raw_is_verified: item.is_verified,
               date: formatDate(new Date(item.created_at || Date.now()), 'short')
            };
          });
          setUsersList(mappedUsers);
        }

        Swal.fire({
          title: 'Berhasil!',
          text: `${formValues.name} telah berhasil ditambahkan sebagai user baru platform!`,
          icon: 'success',
          confirmButtonColor: '#147D73'
        });
      } catch (err) {
        console.error('Gagal menambahkan user ke API:', err);
        Swal.fire({
          title: 'Gagal!',
          text: err.response?.data?.message || 'Gagal menambahkan pengguna ke database.',
          icon: 'error',
          confirmButtonColor: '#147D73'
        });
      }
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
            {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button> */}
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
                        onClick={() => handleOpenModal(user)}
                        className="flex items-center gap-1.5 text-blue-600 text-xs font-bold hover:underline"
                      >
                        Cek Detail
                      </button>
                      <button 
                        onClick={() => toggleKyc(user.id)}
                        className="flex items-center gap-1.5 text-[#147D73] text-xs font-bold hover:underline"
                      >
                        Ubah Status
                      </button>
                      <button 
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Apakah Anda Yakin?',
                            text: `Hapus pengguna ${user.name} secara permanen?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#aaa',
                            confirmButtonText: 'Ya, Hapus'
                          });

                          if (result.isConfirmed) {
                            try {
                              await api.delete(`/users/${user.id}`);
                              setUsersList(usersList.filter(u => u.id !== user.id));
                              Swal.fire({
                                title: 'Dihapus!',
                                text: 'Pengguna berhasil dihapus dari sistem.',
                                icon: 'success',
                                confirmButtonColor: '#147D73'
                              });
                            } catch (err) {
                              console.error('Gagal menghapus user dari API:', err);
                              Swal.fire({
                                title: 'Gagal!',
                                text: err.response?.data?.message || 'Gagal menghapus pengguna.',
                                icon: 'error',
                                confirmButtonColor: '#147D73'
                              });
                            }
                          }
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

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className="relative bg-[#F8FAFA] w-full max-w-5xl max-h-[95vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Users / Detail & Verification</span>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  Review Data User: <span className="text-[#147D73]">{selectedUser.name}</span>
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Data Diri */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Informasi & Edit Profil</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap</label>
                  <input type="text" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                  <input type="date" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" value={editForm.date_of_birth} onChange={e => setEditForm({...editForm, date_of_birth: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Kelamin</label>
                  <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                    <option value="">Pilih...</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">No HP</label>
                  <input type="text" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Alamat</label>
                  <textarea className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" rows="2" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Role Akun</label>
                  <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                    <option value="user">User Biasa</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <button onClick={handleSaveUser} className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3 rounded-xl mt-4 transition-colors">Simpan Perubahan</button>
              </div>

              {/* Data KTP */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Dokumen Identitas (KTP)</h3>
                
                {selectedUser.raw_user.identities && selectedUser.raw_user.identities.length > 0 && (
                  <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nomor Induk Kependudukan (NIK)</p>
                      <p className="font-black text-slate-800 tracking-wider">{selectedUser.raw_user.identities[0].identity_number || 'Belum diatur'}</p>
                    </div>
                  </div>
                )}

                <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-gray-200">
                  {selectedUser.raw_user.identities && selectedUser.raw_user.identities.length > 0 ? (
                    <img src={selectedUser.raw_user.identities[0].identity_image.startsWith('http') ? selectedUser.raw_user.identities[0].identity_image : `http://localhost:8000${selectedUser.raw_user.identities[0].identity_image}`} alt="KTP" className="max-w-full max-h-[60vh] object-contain" />
                  ) : (
                    <div className="text-center text-slate-400 p-8">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                      <p>Pengguna belum mengunggah KTP</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center py-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2024 Care Fund Admin Panel. Developed with love</p>
      </div>
    </div>
  );
};

export default UserManagementTab;
