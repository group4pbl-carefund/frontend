import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserProfilePage from './pages/userProfilePage';
import EducationPage from './pages/educationPage';
import ArtikelDetail from './pages/articleDetail';
import DashboardPage from './pages/dashboardPage';

function App() {

  return (
    <Router>
      <Routes>
        {/* Route untuk halaman utama (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/edukasi" element={<EducationPage />} />
        <Route path="/edukasi/:id" element={<ArtikelDetail />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Nanti kamu bisa menambahkan route halaman lain di bawah sini */}
        {/* Contoh: */}
        {/* <Route path="/donasi/:id" element={<DonationDetailPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App
