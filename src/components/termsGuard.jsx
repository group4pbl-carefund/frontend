import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const TermsGuard = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();

  // If user is not logged in, they are not bound by user terms yet.
  // The login/register pages handle their own flow.
  if (!token || !userStr) {
    return <Outlet />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    return <Outlet />;
  }

  // Admin role is exempted from acceptance gate (they edit terms)
  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  // Fetch the current active terms version from localStorage
  let activeVersion = 'v2.0.0';
  try {
    const versionsStr = localStorage.getItem('carefund_tc_versions');
    if (versionsStr) {
      const versions = JSON.parse(versionsStr);
      const active = versions.find(v => v.status === 'active');
      if (active) activeVersion = active.version;
    }
  } catch (e) {
    console.error('Error reading terms versions', e);
  }

  const userAcceptedVersion = user ? user.acceptedTermsVersion : null;

  // If the user hasn't accepted the active version, block them and redirect
  if (userAcceptedVersion !== activeVersion) {
    return <Navigate to="/accept-terms" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default TermsGuard;
