import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, category, image, readTime, title }) => {
  return (
    <Link
      to={`/edukasi/${id}`}
      className="group cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden mb-4 bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge Category */}
        <div className="absolute top-4 left-4 bg-[#0F7A73] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {category}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex items-center text-xs text-slate-500 mb-2 font-medium">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {readTime}
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-[#147D73] transition-colors">
        {title}
      </h3>
      
      <div className="mt-auto pt-4 inline-flex items-center text-sm font-bold text-[#147D73]">
        Baca Selengkapnya
        <svg className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  );
};

export default ArticleCard;