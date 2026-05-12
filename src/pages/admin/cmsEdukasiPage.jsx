import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainLayout'; // Sesuaikan path

// --- DATA DUMMY ---
const statsData = [
  {
    title: 'TOTAL ARTICLES',
    value: '48',
    badge: '+3 this week',
    icon: (
      <svg className="w-6 h-6 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
  },
  {
    title: 'TOTAL VIEWS',
    value: '12.4K',
    badge: '+12%',
    icon: (
      <svg className="w-6 h-6 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ),
  },
  {
    title: 'CATEGORIES',
    value: '6',
    badge: null,
    icon: (
      <svg className="w-6 h-6 text-[#147D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    ),
  },
];

const articlesData = [
  {
    id: 1,
    title: 'Cara Berdonasi Aman',
    subtitle: 'Quick guide to secure transactions',
    category: 'Security',
    catColor: 'bg-teal-50 text-teal-600',
    authorName: 'Elena Smith',
    authorAvatar: 'https://ui-avatars.com/api/?name=Elena+Smith&background=random',
    date: 'Oct 24, 2023',
    views: '3,421',
    status: 'PUBLISHED',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    title: 'Memahami KYC',
    subtitle: 'Step-by-step verification process',
    category: 'Regulation',
    catColor: 'bg-blue-50 text-blue-600',
    authorName: 'Marco Polo',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marco+Polo&background=random',
    date: 'Oct 22, 2023',
    views: '1,890',
    status: 'DRAFT',
    statusColor: 'bg-gray-100 text-gray-600',
  },
  {
    id: 3,
    title: 'Metode Pembayaran Digital',
    subtitle: 'Overview of modern gateway options',
    category: 'Payment',
    catColor: 'bg-orange-50 text-orange-600',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random',
    date: 'Oct 19, 2023',
    views: '5,102',
    status: 'PUBLISHED',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
];

const CmsEdukasiPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="bg-[#F8FAFA] min-h-screen pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-[#147D73] uppercase tracking-wider mb-3">
                <span className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => navigate('/admin/edukasi')}>Edukasi</span> &gt; Manage Content
              </div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => navigate(-1)} className="hover:bg-gray-200 p-1.5 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Content Management System</h1>
              </div>
              <p className="text-slate-500 text-sm ml-10 max-w-xl">
                Manage education articles and digital literacy tutorials to empower our donor community.
              </p>
            </div>

            <button onClick={() => navigate('/admin/edukasi/manage/create')} className="bg-[#147D73] hover:bg-[#0F655C] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Create New Article
            </button>
          </div>

          {/* --- STATS CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statsData.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="w-12 h-12 bg-[#E8F3F1] rounded-xl flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-1">{stat.title}</h3>
                    <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                  </div>
                  {stat.badge && (
                    <span className="bg-[#E8F3F1] text-[#147D73] text-[10px] font-bold px-2 py-1 rounded-full">
                      {stat.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* --- TABLE SECTION --- */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            
            {/* Table Controls (Search & Filter) */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input type="text" placeholder="Filter articles..." className="bg-gray-100 text-sm font-medium w-full pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147D73]/20" />
                </div>
                
                <select className="bg-gray-100 text-sm font-bold text-slate-600 px-4 py-2.5 rounded-lg border-none focus:ring-0 cursor-pointer appearance-none outline-none">
                  <option>All Categories</option>
                  <option>Security</option>
                  <option>Regulation</option>
                </select>
              </div>
              
              <button className="p-2.5 text-slate-400 hover:text-slate-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {articlesData.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{article.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{article.subtitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${article.catColor}`}>
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={article.authorAvatar} alt={article.authorName} className="w-6 h-6 rounded-full" />
                          <span className="font-semibold text-slate-700 text-xs">{article.authorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-medium">
                        {article.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 text-xs">
                        {article.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider ${article.statusColor}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-3">
                          <button className="text-[#147D73] hover:text-[#0b4d46] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button className="text-red-500 hover:text-red-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">10</span> of <span className="font-bold text-slate-700">48</span> articles
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#147D73] text-white font-bold text-xs">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-gray-100 font-bold text-xs transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-gray-100 font-bold text-xs transition-colors">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-gray-100 font-bold text-xs transition-colors">5</button>
                <button className="p-1 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CmsEdukasiPage;