import React from 'react';

const CategoryCard = ({ title, description, icon, iconBg, linkColor, linkText }) => {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
        {description}
      </p>
      <a href="#" className={`inline-flex items-center text-sm font-bold ${linkColor} hover:opacity-80 transition-opacity`}>
        {linkText}
        <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  );
};

export default CategoryCard;
