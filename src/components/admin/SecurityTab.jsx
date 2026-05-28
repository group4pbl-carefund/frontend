import React, { useState, useEffect } from 'react';
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
import api from '../../utils/api';
import { formatDate } from '../../utils/format';

const SecurityTab = () => {
  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');


  useEffect(() => {
    const fetchSecurityLogs = async () => {
      try {
        const response = await api.get('/security-monitorings');
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          const mappedLogs = data.map(item => {
            const dateObj = new Date(item.created_at || item.updated_at);
            return {
              status: (item.action || 'INVESTIGATING').toUpperCase(),
              priority: (item.severity || 'LOW').toUpperCase(),
              category: item.event_type || 'System',
              description: item.description || 'Aktivitas keamanan tercatat',
              details: item.details || `IP: ${item.ip_address || 'Unknown'} (${item.user_agent || 'Unknown'})`,
              date: formatDate(dateObj, 'short'),
              time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              user: item.user?.full_name || item.user?.email || 'System Log'
            };
          });
          setLogsList(mappedLogs);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Gagal memuat log keamanan dari API:', err);
        setLogsList([]);
      }
      setLoading(false);
    };

    fetchSecurityLogs();
  }, []);

  // Hitung stats secara dinamis berdasarkan logsList
  const totalActivity = logsList.length;
  const highSeverityCount = logsList.filter(log => log.priority === 'HIGH' || log.priority === 'CRITICAL').length;
  const investigatingCount = logsList.filter(log => log.status === 'INVESTIGATING' || log.status === 'PENDING').length;
  const flaggedCount = logsList.filter(log => log.status === 'FLAGGED' || log.status === 'SUSPICIOUS').length;

  const stats = [
    { label: 'TOTAL ACTIVITY', value: totalActivity.toString(), icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'HIGH SEVERITY', value: highSeverityCount.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'UNDER INVESTIGATION', value: investigatingCount.toString(), icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'FLAGGED ITEMS', value: flaggedCount.toString(), icon: Flag, color: 'text-teal-600', bg: 'bg-teal-50' },
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

  // Filter logs berdasarkan activeTab
  const filteredLogs = logsList.filter(log => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'High Priority') return log.priority === 'HIGH';
    if (activeTab === 'Suspicious') return log.status === 'FLAGGED' || log.status === 'INVESTIGATING';
    if (activeTab === 'Resolved') return log.status === 'RESOLVED';
    return true;
  });

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
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white shadow-sm text-teal-600 font-bold' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
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
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, idx) => (
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
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 font-medium italic">
                Tidak ada log aktivitas keamanan untuk filter ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
