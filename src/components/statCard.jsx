import React from 'react';

const StatCard = ({ icon, label, value, subValue, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
      <div className={`${colorClass} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      <p className="text-[10px] text-slate-500 mt-2 font-medium">{subValue}</p>
    </div>
  );
};

export default StatCard;
