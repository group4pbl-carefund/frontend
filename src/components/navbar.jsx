import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-gray-100">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#60C9B3] to-[#428879] text-white font-bold shadow-lg shadow-[#60C9B3]/20">
            CF
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#428879]">
            Care Fund
          </span>
        </Link>
      </div>

      {/* Middle Links - Only visible when logged in */}
      {isLoggedIn && (
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-lg font-bold text-slate-600 hover:text-[#60C9B3] transition-colors">
            Beranda
          </Link>
          <Link to="/dashboard-komunitas" className="text-lg font-bold text-slate-600 hover:text-[#60C9B3] transition-colors">
            Dashboard Komunitas
          </Link>
          <Link to="/edukasi" className="text-lg font-bold text-slate-600 hover:text-[#60C9B3] transition-colors">
            Edukasi
          </Link>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to="/user-profile"
              className="group relative flex items-center justify-center"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#60C9B3] transition-transform group-hover:scale-110 shadow-md">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#60C9B3] transition-colors">
              Log in
            </Link>

            <Link to="/register">
              <button className="rounded-full px-6 py-2.5 text-sm font-bold text-white bg-[#60C9B3] hover:bg-[#4ea894] transition-all shadow-md shadow-[#60C9B3]/20 active:scale-95">
                Daftar
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;