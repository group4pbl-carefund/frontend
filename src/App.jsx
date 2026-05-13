import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserProfilePage from './pages/userProfilePage';
import DashboardPage from './pages/dashboardPage';
import AdminDashboardPage from './pages/admin/adminDashboardPage';
import EducationPage from './pages/educationPage';
import ArtikelDetail from './pages/articleDetail';
import DonationDetailPage from './pages/donationDetailPage';
import ProgramsPage from './pages/programsPage';
import CheckoutPage from './pages/checkoutPage';
import AdminEducationPage from './pages/admin/adminEducationPage';
import CmsEdukasiPage from './pages/admin/cmsEdukasiPage';
import CreateArticlePage from './pages/admin/createArticlePage';
import EditArticlePage from './pages/admin/editArticlePage';
import CreateCampaignPage from './pages/createCampaignPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/edukasi" element={<EducationPage />} />
        <Route path="/edukasi/:id" element={<ArtikelDetail />} />
        <Route path="/donasi" element={<ProgramsPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />
        <Route path="/admin/edukasi" element={<AdminEducationPage />} />
        <Route path="/admin/edukasi/manage" element={<CmsEdukasiPage />} />
        <Route path="/admin/edukasi/manage/create" element={<CreateArticlePage />} />
        <Route path="/admin/edukasi/manage/edit/:id" element={<EditArticlePage />} />
        <Route path="/donasi/:id" element={<DonationDetailPage />} />
        <Route path="/donasi/:id/checkout" element={<CheckoutPage />} />
        <Route path="/buat-kampanye" element={<CreateCampaignPage />} />
      </Routes>
    </Router>
  );
}

export default App;