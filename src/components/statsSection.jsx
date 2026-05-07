import React from 'react';

const statsData = [
  { value: '2 Miliar +', label: 'Total Dana Terkumpul' },
  { value: '10.000 +', label: 'Penerima manfaat' },
  { value: '2.500 +', label: 'Donatur aktif' },
];

const StatsSection = () => {
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
