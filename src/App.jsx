import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserProfilePage from './pages/userProfilePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* Route untuk halaman utama (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />

        {/* Nanti kamu bisa menambahkan route halaman lain di bawah sini */}
        {/* Contoh: */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/donasi/:id" element={<DonationDetailPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App
