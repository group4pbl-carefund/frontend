import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

const DonationHistoryItem = ({ image, category, categoryColor, bgColor, date, title, amount, showBukti = true }) => {
  return (
    <div className="p-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex gap-4">
        <img
          className="h-20 w-20 rounded-2xl object-cover shadow-sm"
          src={image}
          alt={category}
        />
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold ${categoryColor} ${bgColor} px-2 py-0.5 rounded-full uppercase`}>{category}</span>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              <span>BERHASIL</span>
            </div>
          </div>
          <h3 className="font-bold text-slate-900 mb-1 leading-tight">{title}</h3>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Dibayar</p>
              <p className="text-lg font-black text-slate-900">{amount}</p>
            </div>
            <div className="flex gap-2">
              {showBukti && (
                <button className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                  Bukti
                </button>
              )}
              <button className="px-4 py-2 text-xs font-bold text-white bg-[#2ea391] rounded-xl hover:shadow-lg hover:shadow-[#2ea391]/20 transition-all">
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryItem;
