import React from 'react';
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

const TransactionLogTab = () => {
  const stats = [
    { label: 'TOTAL TRANSAKSI', value: '1,240', change: '+12%', icon: TrendingUp, positive: true },
    { label: 'TOTAL VOLUME', value: 'Rp 4.25B', change: '+8.4%', icon: TrendingUp, positive: true },
    { label: 'PENDING VERIFICATIONS', value: '12', action: 'ACTION REQ', icon: AlertCircle, positive: false },
    { label: 'SUCCESS RATE', value: '99.2%', progress: 99, icon: CheckCircle2, positive: true },
  ];

  const transactions = [
    {
      id: '#TRX-93231',
      date: 'Oct 24, 2023',
      time: '14:22',
      user: 'Jane Doe',
      avatar: 'JD',
      program: 'Clean Water Initiative',
      amount: 'Rp 500.000',
      method: 'Bank Transfer',
      status: 'SUCCESS'
    },
    {
      id: '#TRX-93232',
      date: 'Oct 24, 2023',
      time: '15:10',
      user: 'Ahmad Rizky',
      avatar: 'AR',
      program: 'General Fund',
      amount: 'Rp 1.250.000',
      method: 'QRIS',
      status: 'PENDING'
    },
    {
      id: '#TRX-93233',
      date: 'Oct 24, 2023',
      time: '15:45',
      user: 'Sarah Wilson',
      avatar: 'SW',
      program: 'Scholarship Fund',
      amount: 'Rp 200.000',
      method: 'Credit Card',
      status: 'FAILED'
    },
    {
      id: '#TRX-93234',
      date: 'Oct 24, 2023',
      time: '16:02',
      user: 'Budi Mulia',
      avatar: 'BM',
      program: 'Emergency Relief',
      amount: 'Rp 5.000.000',
      method: 'Bank Transfer',
      status: 'SUCCESS'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Log Transaksi</h2>
          <p className="text-gray-500">Memantau dan mengaudit semua dana yang masuk dan keluar.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#149187] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0f7169] transition-colors shadow-sm">
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
            placeholder="Search Transaction ID or User"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-all">
          <Calendar className="w-4 h-4" />
          Date Range: Last 30 Days
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-all">
          Status: All
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-all">
          Method: All
        </div>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 transition-all">
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
              {transactions.map((trx, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing 1-5 of 1,240 transactions</p>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronLeft className="w-5 h-5" /></button>
            {[1, 2, 3, '...', 248].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1 ? 'bg-[#149187] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
            <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLogTab;


