import React from 'react';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

const DonationHistoryItem = ({ donation, onDetailClick }) => {
  const image = donation?.program?.image_url || '';
  const category = donation?.program?.category || 'Umum';
  const statusLower = donation?.payment_status?.toLowerCase();
  const isSuccess = ['success', 'paid', 'settlement', 'completed'].includes(statusLower);
  const isFailedBackend = ['deny', 'cancel', 'expire', 'failure', 'failed'].includes(statusLower);
  const createdAt = donation?.created_at ? new Date(donation.created_at).getTime() : 0;
  const expiresAt = createdAt + 15 * 60 * 1000;
  const isExpired = !isSuccess && (!isFailedBackend && Date.now() > expiresAt) || isFailedBackend;
  
  const categoryColor = isSuccess ? "text-emerald-600" : isExpired ? "text-rose-600" : "text-amber-600";
  const bgColor = isSuccess ? "bg-emerald-50" : isExpired ? "bg-rose-50" : "bg-amber-50";
  const date = donation?.date || '';
  const title = donation?.program?.title || '';
  const amount = donation?.formatted_amount || '';
  return (
    <div className="p-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex gap-4">
        <img
          className="h-20 w-20 rounded-2xl object-cover shadow-sm"
          src={image || "https://placehold.co/100x100/eeeeee/999999?text=No+Image"}
          alt={category}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/eeeeee/999999?text=No+Image"; }}
        />
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold ${categoryColor} ${bgColor} px-2 py-0.5 rounded-full uppercase`}>{category}</span>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${isSuccess ? 'text-emerald-500 bg-emerald-50' : isExpired ? 'text-rose-500 bg-rose-50' : 'text-amber-500 bg-amber-50'} px-2 py-0.5 rounded-full`}>
              {isSuccess ? <CheckCircle2 size={10} /> : isExpired ? <XCircle size={10} /> : <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
              <span>{isSuccess ? 'BERHASIL' : isExpired ? 'GAGAL' : 'PENDING'}</span>
            </div>
          </div>
          <h3 className="font-bold text-slate-900 mb-1 leading-tight">{title}</h3>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Jumlah Donasi</p>
              <p className="text-lg font-black text-slate-900">{amount}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onDetailClick} className="px-4 py-2 text-xs font-bold text-white bg-[#147D73] rounded-xl hover:shadow-lg hover:shadow-[#147D73]/20 transition-all">
                Detail Transaksi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryItem;
