import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../utils/api';

const TermsGuard = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [activeVersion, setActiveVersion] = useState(null);

  useEffect(() => {
    // If user is not logged in, they are not bound by user terms yet.
    if (!token || !userStr) {
      setLoading(false);
      return;
    }
    
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      setLoading(false);
      return;
    }

    // Admin role is exempted from acceptance gate
    if (user && user.role === 'admin') {
      setLoading(false);
      return;
    }

    const fetchVersion = async () => {
      try {
        const response = await api.get('/term-versions');
        const versions = response.data?.data || response.data;
        if (Array.isArray(versions) && versions.length > 0) {
          const sorted = [...versions].sort((a, b) => b.version_id - a.version_id);
          setActiveVersion(sorted[0].version_number);
        }
      } catch (e) {
        console.error('Error reading terms versions', e);
      }
      setLoading(false);
    };

    fetchVersion();
  }, [token, userStr]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#147D73] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-teal-800">Memeriksa Sesi...</p>
        </div>
      </div>
    );
  }

  if (!token || !userStr) {
    return <Outlet />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return <Outlet />;
  }

  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  const userAcceptedVersion = user ? user.acceptedTermsVersion : null;

  // If the user hasn't accepted the active version, block them and redirect
  if (activeVersion && String(userAcceptedVersion) !== String(activeVersion)) {
    return <Navigate to="/accept-terms" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default TermsGuard;
