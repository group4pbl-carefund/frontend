import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [user] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-gray-100">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/pavicon.png"
            alt="Care Fund Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-[#147D73]">
            Care Fund
          </span>
        </Link>
      </div>

      {/* Middle Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-lg font-bold text-slate-600 hover:text-[#147D73] transition-colors">
          Beranda
        </Link>

        {isLoggedIn && (
          <>
            {userRole === 'admin' ? (
              <>
                <Link to="/admin" className="text-lg font-bold text-slate-600 hover:text-[#147D73] transition-colors">
                  Admin Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-lg font-bold text-slate-600 hover:text-[#147D73] transition-colors">
                  Dashboard
                </Link>
              </>
            )}

            <Link
              to={userRole === 'admin' ? '/admin/edukasi' : '/edukasi'}
              className="text-lg font-bold text-slate-600 hover:text-[#147D73] transition-colors"
            >
              Edukasi
            </Link>
          </>
        )}

        <Link to="/about-us" className="text-lg font-bold text-slate-600 hover:text-[#147D73] transition-colors">
          Tentang Kami
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to="/user-profile"
              className="group relative flex items-center justify-center"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#147D73] transition-transform group-hover:scale-110 shadow-md flex items-center justify-center bg-[#147D73] text-white font-bold text-sm">
                {user?.avatar_url ? (
                  <img
                    src={`${user.avatar_url.startsWith('http') ? '' : '/storage/'}${user.avatar_url}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{(user?.full_name || '?')[0]}</span>
                )}
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
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#147D73] transition-colors">
              Log in
            </Link>

            <Link to="/register">
              <button className="rounded-full px-6 py-2.5 text-sm font-bold text-white bg-[#147D73] hover:bg-[#0F655C] transition-all shadow-md shadow-[#147D73]/20 active:scale-95">
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