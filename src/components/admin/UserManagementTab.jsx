import React from 'react';
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

const UserManagementTab = () => {
  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12% BULAN INI', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Verified KYC', value: '9,820', change: '79% TARGET', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Verification', value: '432', change: 'BUTUH ATENSI', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const users = [
    {
      name: 'Ahmad Santoso',
      email: 'ahmad@email.com',
      avatar: 'AS',
      kyc: 'Verified',
      date: '12 Okt 2023'
    },
    {
      name: 'Jane Doe',
      email: 'jane@email.com',
      avatar: 'JD',
      kyc: 'Pending',
      date: '15 Okt 2023'
    },
    {
      name: 'Jessica Tan',
      email: 'jessica@email.com',
      avatar: 'JT',
      kyc: 'Verified',
      date: '20 Okt 2023'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
          <p className="text-gray-500">Pantau dan kelola seluruh pengguna platform.</p>
        </div>
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
              <button key={tab} className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'Semua' ? 'bg-[#149187] text-white shadow-lg shadow-teal-900/10' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all">
              <Filter className="w-4 h-4" />
              Filter Lanjutan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all">
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
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50/50">
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
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit ${
                      user.kyc === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.kyc === 'Verified' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{user.kyc}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-600 font-medium">{user.date}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <button className="flex items-center gap-1.5 text-[#149187] text-xs font-bold hover:underline">
                        Detail
                      </button>
                      <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-10 flex items-center justify-between border-t border-gray-50">
          <p className="text-xs text-gray-400">Menampilkan 1 - 3 dari 12,450 pengguna</p>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
            {[1, 2, 3, '...', 415].map((page, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${page === 1 ? 'bg-[#149187] text-white shadow-lg shadow-teal-900/20' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
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
