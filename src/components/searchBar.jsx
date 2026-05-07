import React from 'react';

const SearchBar = ({ placeholder = 'Cari artikel edukasi...', onSearch }) => {
  return (
    <div className="relative max-w-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full pl-11 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#147D73] focus:border-[#147D73] sm:text-sm transition-shadow"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
