import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Download,
  Search,
  Calendar,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2,
  Wallet,
  Activity,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import api from '../../utils/api';
import { formatDate } from '../../utils/format';

const TransactionLogTab = () => {
  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/payment-logs');
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          const mappedTrx = data.map(item => {
            const dateObj = new Date(item.created_at || Date.now());
            const donation = item.donation || {};
            const user = donation.user || {};
            const program = donation.program || {};
            const formatRupiah = (val) => {
              return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
            };

            const getInitials = (name) => {
              return (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            };

            return {
              id: item.transaction_id || `#TRX-${item.id}`,
              date: formatDate(dateObj, 'short'),
              time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              user: user.full_name || 'Anonim',
              avatar: getInitials(user.full_name || 'Anonim'),
              program: program.title || 'General Fund',
              amount: formatRupiah(donation.total_amount || donation.amount || 0),
              rawAmount: donation.total_amount || donation.amount || 0,
              method: donation.payment_method || item.payment_type || 'Unknown',
              status: (donation.payment_status || 'SUCCESS').toUpperCase()
            };
          });
          setLogsList(mappedTrx);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Gagal memuat log transaksi dari API:', err);
        setLogsList([]);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  // Hitung stats berdasarkan logsList secara dinamis
  const totalTrx = logsList.length;
  
  const totalVolumeAmount = logsList
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
    
  const formatVol = (val) => {
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)}M`;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const pendingCount = logsList.filter(t => t.status === 'PENDING').length;
  const successCount = logsList.filter(t => t.status === 'SUCCESS').length;
  const successRate = totalTrx > 0 ? ((successCount / totalTrx) * 100).toFixed(1) : '100';

  const stats = [
    { label: 'TOTAL TRANSAKSI', value: totalTrx.toLocaleString('id-ID'), change: '+12%', icon: TrendingUp, positive: true },
    { label: 'TOTAL VOLUME', value: formatVol(totalVolumeAmount), change: '+8.4%', icon: TrendingUp, positive: true },
    { label: 'PENDING VERIFICATIONS', value: pendingCount.toString(), action: 'ACTION REQ', icon: AlertCircle, positive: false },
    { label: 'SUCCESS RATE', value: `${successRate}%`, progress: parseFloat(successRate), icon: CheckCircle2, positive: true },
  ];

  const filteredTrx = logsList.filter(trx => {
    const matchesSearch = 
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.program.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeStatus === 'All' || trx.status.toLowerCase() === activeStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Log Transaksi</h2>
          <p className="text-gray-500">Memantau dan mengaudit semua dana yang masuk dan keluar.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#147D73] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0F655C] transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              {stat.change && (
                <div className="flex items-center text-[10px] font-bold text-teal-600 mb-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              )}
              {stat.action && (
                <div className="text-[9px] font-bold text-teal-600 border border-teal-200 px-2 py-0.5 rounded uppercase">
                  {stat.action}
                </div>
              )}
            </div>
            {stat.progress && (
              <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${stat.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BEP Analysis Mini Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Web Maintenance & BEP Analysis</h4>
            <div className="bg-teal-50 p-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Maint. Cost</p>
              <p className="text-sm font-bold text-rose-600 tracking-tight">Rp 12.500.000</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Fee Revenue</p>
              <p className="text-sm font-bold text-teal-600 tracking-tight">Rp 10.850.000</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-gray-700">Break Even Point (BEP)</p>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">BELUM TERCAPAI</span>
              <span className="text-xs font-bold text-gray-800">86.8%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500" style={{ width: '86.8%' }}></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-teal-50/50 rounded-xl">
            <p className="text-[10px] text-teal-900 leading-relaxed font-medium">
              <span className="font-bold">Analysis:</span> Platform needs Rp 1.650.000 more in service fees to cover operational costs this month.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#f5faf9] p-6 rounded-3xl border border-teal-50 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-50/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Avg Fee per Trx</p>
            <p className="text-lg font-bold text-gray-800 tracking-tight">Rp 8.750</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-50/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Servers Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-lg font-bold text-gray-800 tracking-tight">Optimal</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-50/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Cost Projection</p>
            <p className="text-lg font-bold text-gray-800 tracking-tight">+4.2% <span className="text-xs font-normal text-gray-400 ml-1">vs last mo</span></p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-50/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Next Maintenance</p>
            <p className="text-lg font-bold text-gray-800 tracking-tight">Nov 12</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari ID Transaksi, Donatur, atau Program..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          value={activeStatus}
          onChange={(e) => setActiveStatus(e.target.value)}
          className="bg-gray-50 px-4 py-2 border-none rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-teal-500/20 outline-none cursor-pointer"
        >
          <option value="All">Semua Status</option>
          <option value="Success">SUCCESS</option>
          <option value="Pending">PENDING</option>
          <option value="Failed">FAILED</option>
        </select>
        <button 
          onClick={() => {
            setSearchQuery('');
            setActiveStatus('All');
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Program</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTrx.length > 0 ? (
                filteredTrx.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 text-sm font-bold text-teal-700">{trx.id}</td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-gray-800">{trx.date}</div>
                      <div className="text-xs text-gray-400">{trx.time}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                          {trx.avatar}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{trx.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600 font-medium">{trx.program}</td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-800">{trx.amount}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        {trx.method === 'Bank Transfer' ? <Building2 className="w-3.5 h-3.5" /> :
                          trx.method === 'QRIS' ? <Search className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                        {trx.method}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-tighter ${trx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          trx.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                            'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-8 py-12 text-center text-slate-400 font-medium italic">
                    Tidak ada log transaksi yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">Menampilkan {filteredTrx.length} dari {logsList.length} transaksi</p>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-8 h-8 rounded-lg text-xs font-bold bg-[#147D73] text-white">1</button>
            <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLogTab;
