import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainLayout';
import { ArrowLeft } from 'lucide-react';
import SecurityTab from '../../components/admin/SecurityTab';
import TransactionLogTab from '../../components/admin/TransactionLogTab';
import UserManagementTab from '../../components/admin/UserManagementTab';
import TermsManagementTab from '../../components/admin/TermsManagementTab';
import ManageCampaignTab from '../../components/admin/ManageCampaignTab';

const AdminDashboardPage = () => {
  const location = useLocation();

  // Get active tab from path: /admin/security -> security
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[2] || 'security';

  const tabs = [
    { id: 'security', label: 'Security', path: '/admin/security' },
    { id: 'transactions', label: 'Log Transaksi', path: '/admin/transactions' },
    { id: 'users', label: 'Manage User', path: '/admin/users' },
    { id: 'terms', label: 'Syarat & Ketentuan', path: '/admin/terms' },
    { id: 'campaigns', label: 'Manage Campaign', path: '/admin/campaigns' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F4F7F6] py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="flex items-start gap-6">
              <button
                onClick={() => window.history.back()}
                className="mt-2 p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-all group"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-[#147D73]" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2 capitalize">
                  {activeTab === 'security' ? 'Security' :
                    activeTab === 'transactions' ? 'Log Transaksi' :
                      activeTab === 'users' ? 'Manajemen User' :
                        activeTab === 'campaigns' ? 'Manage Campaign' :
                          'Syarat & Ketentuan'}
                </h1>
                <p className="text-gray-500 max-w-2xl font-medium">
                  {activeTab === 'security' ? 'Cek keamanan sistem.' :
                    activeTab === 'transactions' ? 'Pantau semua dana yang masuk & keluar.' :
                      activeTab === 'users' ? 'Pantau dan kelola seluruh pengguna platform.' :
                        activeTab === 'campaigns' ? 'Tinjau kampanye baru dari Tahap 3 Verifikasi.' :
                          activeTab === 'edukasi' ? 'Tinjau dan kelola konten edukasi untuk platform' :
                            'Kelola pembaruan T&C bagi pengguna platform.'}
                </p>
              </div>
            </div>

            {/* Sub-Navigation */}
            <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[20px] shadow-sm border border-white/50">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-8 py-3 rounded-[16px] text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-white text-[#147D73] shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-transparent">
            <Routes>
              <Route index element={<Navigate to="security" replace />} />
              <Route path="security" element={<SecurityTab />} />
              <Route path="transactions" element={<TransactionLogTab />} />
              <Route path="users" element={<UserManagementTab />} />
              <Route path="terms" element={<TermsManagementTab />} />
              <Route path="campaigns" element={<ManageCampaignTab />} />
            </Routes>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
