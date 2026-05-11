import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserProfilePage from './pages/userProfilePage';
import DashboardPage from './pages/dashboardPage';
import AdminDashboardPage from './pages/adminDashboardPage';
import EducationPage from './pages/educationPage';
import DonationDetailPage from './pages/donationDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/dashboard-komunitas" element={<DashboardPage />} />
        <Route path="/edukasi" element={<EducationPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />

        {/* Nanti kamu bisa menambahkan route halaman lain di bawah sini */}
        <Route path="/donasi/:id" element={<DonationDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;