import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Flag, 
  Server, 
  Lock, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SecurityTab = () => {
  const stats = [
    { label: 'TOTAL ACTIVITY', value: '5', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'HIGH SEVERITY', value: '2', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'UNDER INVESTIGATION', value: '1', icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'FLAGGED ITEMS', value: '1', icon: Flag, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const systems = [
    { 
      title: 'Server Status', 
      icon: Server,
      items: [
        { name: 'Main Gateway', status: 'ONLINE', statusColor: 'bg-emerald-500' },
        { name: 'Backup Node', status: 'ONLINE', statusColor: 'bg-emerald-500' },
        { name: 'Database Cluster', status: 'ONLINE', statusColor: 'bg-emerald-500' },
      ]
    },
    { 
      title: 'Encryption Status', 
      icon: Lock,
      items: [
        { name: 'SSL/TLS 1.3', status: 'VALID', statusColor: 'bg-emerald-500' },
        { name: 'Data-at-Rest', status: 'ACTIVE', statusColor: 'bg-emerald-500' },
        { name: 'API Endpoints', status: 'SECURE', statusColor: 'bg-emerald-500' },
      ]
    },
    { 
      title: 'Security Systems', 
      icon: ShieldCheck,
      items: [
        { name: 'Advanced Firewall', status: 'ACTIVE', statusColor: 'bg-emerald-500' },
        { name: 'DDoS Mitigation', status: 'ACTIVE', statusColor: 'bg-emerald-500' },
        { name: 'Intrusion Detection', status: 'ACTIVE', statusColor: 'bg-emerald-500' },
      ]
    },
  ];

  const logs = [
    {
      status: 'INVESTIGATING',
      priority: 'HIGH',
      category: 'Suspicious',
      description: 'Multiple failed login attempts',
      details: 'Detected from non-standard region (IP: 192.168.45.12)',
      date: 'Oct 24, 2023',
      time: '14:23 PM',
      user: 'user_jdoe88'
    },
    {
      status: 'FLAGGED',
      priority: 'MEDIUM',
      category: 'Transaction',
      description: 'Large donation transaction flagged',
      details: 'Amount exceeding $10k standard threshold',
      date: 'Oct 24, 2023',
      time: '11:05 AM',
      user: 'system_audit'
    },
    {
      status: 'RESOLVED',
      priority: 'LOW',
      category: 'System',
      description: 'Automatic certificate renewal',
      details: 'SSL certificate for subdomain successfully renewed',
      date: 'Oct 23, 2023',
      time: '09:45 AM',
      user: 'cloud_manager'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Security</h2>
          <p className="text-gray-500">Real-time threat detection and infrastructure monitoring.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} p-2 rounded-xl`}>
              <stat.icon className={`${stat.color} w-5 h-5`} />
            </div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {systems.map((sys, idx) => (
          <div key={idx} className="bg-[#f0f9f9]/50 p-6 rounded-3xl border border-teal-50">
            <div className="flex items-center gap-2 mb-6">
              <sys.icon className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-gray-800">{sys.title}</h3>
            </div>
            <div className="space-y-3">
              {sys.items.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-600 tracking-tighter">{item.status}</span>
                    <div className={`w-2 h-2 rounded-full ${item.statusColor}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Security Activity Log</h3>
            <p className="text-sm text-gray-500">Detailed historical log of all security events and flags.</p>
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl gap-1">
            {['Semua', 'High Priority', 'Suspicious', 'Resolved'].map((tab) => (
              <button key={tab} className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${tab === 'Semua' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            <div className="col-span-1">Status & Priority</div>
            <div>Category</div>
            <div className="col-span-2">Description</div>
            <div>Date & User</div>
          </div>

          <div className="space-y-4">
            {logs.map((log, idx) => (
              <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl grid grid-cols-5 items-center gap-4 border border-transparent hover:border-teal-100 transition-colors">
                <div className="space-y-1">
                  <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    log.status === 'INVESTIGATING' ? 'bg-rose-50 text-rose-600' : 
                    log.status === 'FLAGGED' ? 'bg-teal-50 text-teal-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {log.status}
                  </div>
                  <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full block w-fit ${
                    log.priority === 'HIGH' ? 'bg-rose-600 text-white' : 
                    log.priority === 'MEDIUM' ? 'bg-teal-600 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {log.priority}
                  </div>
                </div>
                <div className="font-bold text-gray-700 text-sm">{log.category}</div>
                <div className="col-span-2">
                  <div className="font-bold text-gray-800">{log.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-gray-800">{log.date}</div>
                  <div className="text-gray-500">{log.time} • {log.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
