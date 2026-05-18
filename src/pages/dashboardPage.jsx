import React from 'react';
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
  const statsData = [
    { title: 'Total Dana Terkumpul', value: 'Rp 4.250.000.000', badge: '+12.5%', icon: '💰' },
    { title: 'Penerima Manfaat', value: '12.840 Jiwa', icon: '👥' },
    { title: 'Program Aktif', value: '45 Program', icon: '📋' },
    { title: 'Distribusi Selesai', value: '1.205 Kasus', icon: '✅' },
  ];

  const donationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: '2024',
        data: [650, 590, 800, 810, 560, 550],
        borderColor: '#147D73',
        backgroundColor: 'rgba(20, 125, 115, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: ['Pendidikan', 'Kesehatan', 'Bencana Alam', 'Sosial'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ['#147D73', '#60C9B3', '#F59E0B', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  };

  const featuredPrograms = [
    {
      category: 'PENDIDIKAN',
      location: 'KALIMANTAN TIMUR',
      title: 'Bantuan Pendidikan Anak Pedalaman Kalimantan',
      collected: 'Rp 38.750.000',
      target: 'Rp 50.000.000',
      progress: 78,
      deadline: 'Berakhir dalam 12 hari',
      donors: '1.240 Donatur',
    },
    {
      category: 'KESEHATAN',
      location: 'SULAWESI SELATAN',
      title: 'Operasi Katarak Gratis Lansia Pesisir',
      collected: 'Rp 82.100.000',
      target: 'Rp 90.000.000',
      progress: 91,
      deadline: 'Berakhir dalam 3 hari',
      donors: '3.150 Donatur',
    },
  ];

  const activities = [
    { title: 'Beasiswa Kuliah 2024', date: '12 Mei 2024', category: 'Pendidikan' },
    { title: 'Bantuan Pendidikan Anak', date: '10 Mei 2024', category: 'Pendidikan' },
    { title: 'Klinik Desa Berdaya', date: '08 Mei 2024', category: 'Kesehatan' },
  ];

  const distributions = [
    { amount: 'Rp 150.000.000', status: 'SELESAI' },
    { amount: 'Rp 75.250.000', status: 'SELESAI' },
    { amount: 'Rp 210.000.000', status: 'PROSES' },
  ];

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
