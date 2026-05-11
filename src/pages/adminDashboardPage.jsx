import React from 'react';
import MainLayout from '../layouts/mainLayout';

const AdminDashboardPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Kelola seluruh aktivitas Care Fund dari sini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total User</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,250</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Donasi</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">Rp 4.2M</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Program Aktif</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Distribusi Selesai</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,205</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manajemen Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
                Kelola Program
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg">
                Kelola User
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg">
                Kelola Distribusi
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
