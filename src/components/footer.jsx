import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white px-8 py-12 border-t border-gray-200">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src="/pavicon.png" alt="Logo" className="h-6 w-6 object-contain" />
            <span className="text-lg font-bold text-[#428879]">Care Fund</span>
          </div>
          <p className="text-xs text-slate-500">
            Platform donasi terpercaya untuk menciptakan dampak nyata bagi masa depan Indonesia.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-slate-900">Program</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-[#60C9B3]">Pendidikan</a></li>
            <li><a href="#" className="hover:text-[#60C9B3]">Kesehatan</a></li>
            <li><a href="#" className="hover:text-[#60C9B3]">Bencana Alam</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-slate-900">Care Fund</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/about-us" className="hover:text-[#60C9B3]">Tentang Kami</Link></li>
            <li><Link to="/accept-terms" className="hover:text-[#60C9B3]">Syarat & Ketentuan</Link></li>
            <li><a href="#" className="hover:text-[#60C9B3]">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-slate-900">Ikuti Kami</h4>
          <div className="flex space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-slate-500 hover:bg-[#60C9B3] hover:text-white cursor-pointer">IG</div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-slate-500 hover:bg-[#60C9B3] hover:text-white cursor-pointer">TW</div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-slate-500 hover:bg-[#60C9B3] hover:text-white cursor-pointer">FB</div>
          </div>
        </div>
        
      </div>
      
      <div className="mt-12 text-center text-xs text-slate-400">
        © 2026 Care Fund Foundation. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;