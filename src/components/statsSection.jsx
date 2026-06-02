import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const StatsSection = () => {
  const [statsData, setStatsData] = useState([
    { value: '0', label: 'Total Dana Terkumpul' },
    { value: '0', label: 'Penerima manfaat' },
    { value: '0', label: 'Donatur aktif' },
  ]);

  useEffect(() => {
    api.get('/public-stats')
      .then((res) => {
        if (res.data?.success) {
          const data = res.data.data;
          setStatsData([
            { value: data.total_dana || '0', label: 'Total Dana Terkumpul' },
            { value: data.penerima_manfaat || '0', label: 'Penerima manfaat' },
            { value: data.donatur_aktif || '0', label: 'Donatur aktif' },
          ]);
        }
      })
      .catch((err) => {
        console.error('Failed to load public stats:', err);
      });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center space-y-6 bg-white py-10 shadow-sm md:flex-row md:space-x-24 md:space-y-0">
      {statsData.map((stat, index) => (
        <div key={index} className="text-center">
          <h2 className="text-4xl font-bold text-[#60C9B3]">{stat.value}</h2>
          <p className="text-sm font-medium text-slate-600 mt-1">{stat.label}</p>
        </div>
      ))}
    </section>
  );
};

export default StatsSection;
