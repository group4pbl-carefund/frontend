import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage'; 
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserProfilePage from './pages/userProfilePage';
import DashboardPage from './pages/dashboardPage';
import EducationPage from './pages/educationPage';

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

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;