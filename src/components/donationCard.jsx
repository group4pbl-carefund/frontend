import React from 'react';

const CampaignCard = ({ 
  imageSrc, 
  category, 
  title, 
  description, 
  collectedAmount, 
  progressPercentage, 
  targetAmount 
}) => {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col">
      {/* Bagian Gambar & Badge Kategori */}
      <div className="relative h-48 w-full bg-gray-200">
         <img src={imageSrc} alt={category} className="h-full w-full object-cover" />
         <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#60C9B3]">
           {category}
         </div>
      </div>
      
      {/* Bagian Konten Teks */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="mb-2 text-xl font-bold text-slate-900 leading-snug">
          {title}
        </h3>
        <p className="mb-6 text-xs text-slate-500 line-clamp-2">
          {description}
        </p>
        
        {/* Bagian Progress Bar & Tombol (Didorong ke bawah menggunakan mt-auto) */}
        <div className="mt-auto">
          <div className="mb-1 flex justify-between text-sm font-bold">
            <span className="text-slate-800">Terkumpul : {collectedAmount}</span>
            <span className="text-[#60C9B3]">{progressPercentage}%</span>
          </div>
          <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
            {/* Lebar progress bar menyesuaikan dengan prop progressPercentage */}
            <div 
              className="h-full rounded-full bg-[#60C9B3]" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mb-5 text-xs text-slate-400">
            Target: {targetAmount}
          </div>
          
          <button className="w-full rounded-xl bg-[#F0F2F1] py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-gray-200">
            Donasi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;