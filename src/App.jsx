import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman utama (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Nanti kamu bisa menambahkan route halaman lain di bawah sini */}
        {/* Contoh: */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/donasi/:id" element={<DonationDetailPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;