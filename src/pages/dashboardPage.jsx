import React, { useState, useEffect } from 'react';
import { Wallet, Users, ClipboardList, CheckCircle } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import MainLayout from '../layouts/mainLayout';
import api from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    donation_trend: { labels: [], data: [] },
    category_data: { labels: [], data: [] },
    featured_programs: [],
    activities: [],
    distributions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data?.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { title: 'Total Dana Terkumpul', value: dashboardData.stats.total_dana || 'Rp 0', icon: <Wallet className="w-7 h-7 text-[#147D73]" /> },
    { title: 'Penerima Manfaat', value: dashboardData.stats.penerima_manfaat || '0 Jiwa', icon: <Users className="w-7 h-7 text-[#147D73]" /> },
    { title: 'Program Aktif', value: dashboardData.stats.program_aktif || '0 Program', icon: <ClipboardList className="w-7 h-7 text-[#147D73]" /> },
    { title: 'Distribusi Selesai', value: dashboardData.stats.distribusi_selesai || '0 Kasus', icon: <CheckCircle className="w-7 h-7 text-[#147D73]" /> },
  ];

  const donationTrendData = {
    labels: dashboardData.donation_trend.labels.reverse(), // Show oldest to newest
    datasets: [
      {
        label: new Date().getFullYear().toString(),
        data: dashboardData.donation_trend.data.reverse(),
        borderColor: '#147D73',
        backgroundColor: 'rgba(20, 125, 115, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: dashboardData.category_data.labels,
    datasets: [
      {
        data: dashboardData.category_data.data,
        backgroundColor: ['#147D73', '#60C9B3', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const { featured_programs: featuredPrograms, activities, distributions } = dashboardData;

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#149187] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-teal-800">Memuat Data Dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Transparansi Komunitas</h1>
            <p className="mt-2 text-gray-600">Pemantauan real-time untuk setiap kontribusi dan distribusi dana demi menjaga amanah para donatur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  {stat.badge && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tren Donasi Bulanan</h2>
              <Bar data={donationTrendData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="bg-white rounded-lg shadow p-2 mb-4 pb-18" style={{ height: '350px' }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center w-full justify-center">Distribusi per Kategori</h2>
              <Doughnut style={{ boxSizing: 'border-box', display: 'block', height: '270px', width: '270px', marginLeft: 'auto', marginRight: 'auto' }} data={categoryData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Unggulan</h2>
            <div className="space-y-4">
              {featuredPrograms.map((program, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#E8F3F1] text-[#147D73] text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">{program.category}</span>
                        <span className="text-gray-500 text-sm">{program.location}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{program.collected} dari {program.target}</span>
                        <span>•</span>
                        <span>{program.donors}</span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#147D73] h-2.5 rounded-full" style={{ width: `${program.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-sm text-gray-600">
                          <span>{program.progress}%</span>
                          <span className="text-orange-600 font-medium">{program.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terkini</h2>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">{activity.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Dana (Program Aktif)</h2>
              <div className="space-y-3">
                {distributions.map((dist, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-900">{dist.amount}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${dist.status === 'SELESAI' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {dist.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-[#147D73] hover:bg-[#0F655C] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#147D73]/10 hover:shadow-xl active:scale-[0.98]">
              Lihat Seluruh Riwayat Distribusi
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
