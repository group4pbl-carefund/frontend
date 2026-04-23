import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#60C9B3] text-white font-bold">
          CF
        </div>
        <span className="text-xl font-bold text-[#428879]">
          Care Fund
        </span>
      </div>
      
      <div className="flex items-center space-x-6">
        <a href="#login" className="font-semibold text-slate-600 hover:text-[#60C9B3]">
          Log in
        </a>
        <button className="rounded px-6 py-2 text-sm font-semibold text-white bg-[#60C9B3] hover:bg-[#4ea894]">
          Daftar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;