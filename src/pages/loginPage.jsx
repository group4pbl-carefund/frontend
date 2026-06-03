import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../utils/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ password: '', password_confirmation: '', token: '', email: '' });
  const [modalLoading, setModalLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === 'true' && params.get('token') && params.get('email')) {
      setResetData(prev => ({
        ...prev,
        token: params.get('token'),
        email: params.get('email')
      }));
      setShowResetModal(true);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8 || formData.password.length > 21) {
      return Swal.fire({
        title: 'Peringatan!',
        text: 'Kata sandi harus antara 8 hingga 21 karakter!',
        icon: 'warning',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#147D73'
      });
    }

    if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
      return Swal.fire({
        title: 'Peringatan!',
        text: 'Kata sandi hanya boleh berisi kombinasi huruf dan angka!',
        icon: 'warning',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#147D73'
      });
    }

    setLoading(true);
    
    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };
      
      if (otpCode) {
        payload.otp_code = otpCode;
      }

      const response = await api.post('/login', payload);

      if (response.data.requires_otp) {
        setShowOtpModal(true);
        Swal.fire({
          title: 'Perangkat Baru!',
          text: response.data.message,
          icon: 'info',
          confirmButtonColor: '#147D73'
        });
        setLoading(false);
        return;
      }

      if (showOtpModal) setShowOtpModal(false);

      const user = response.data.data.user;
      localStorage.setItem('token', response.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      await Swal.fire({
        title: 'Berhasil!',
        text: 'Login Berhasil! Selamat datang di Care Fund',
        icon: 'success',
        confirmButtonText: 'Masuk Dashboard',
        confirmButtonColor: '#147D73'
      });
      
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: 'Gagal!',
        text: error.response?.data?.message || 'Login gagal. Silakan periksa kembali email dan password Anda.',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#147D73'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const response = await api.post('/forgot-password', { email: forgotEmail });
      Swal.fire('Berhasil!', response.data.message || 'Link reset password telah dikirim ke email Anda.', 'success');
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (error) {
      Swal.fire('Gagal!', error.response?.data?.message || 'Gagal mengirim email reset.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.password !== resetData.password_confirmation) {
      return Swal.fire('Error', 'Konfirmasi password tidak cocok!', 'error');
    }
    if (resetData.password.length < 8 || resetData.password.length > 21) {
      return Swal.fire('Error', 'Password harus antara 8 hingga 21 karakter!', 'error');
    }
    if (!/^[a-zA-Z0-9]+$/.test(resetData.password)) {
      return Swal.fire('Error', 'Password hanya boleh berisi kombinasi huruf dan angka!', 'error');
    }
    
    setModalLoading(true);
    try {
      const response = await api.post('/reset-password', {
        email: resetData.email,
        token: resetData.token,
        password: resetData.password,
        password_confirmation: resetData.password_confirmation
      });
      Swal.fire('Berhasil!', response.data.message || 'Password berhasil direset. Silakan login.', 'success');
      setShowResetModal(false);
      navigate('/login'); // Clean up URL
    } catch (error) {
      Swal.fire('Gagal!', error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-[#1a1a1a] p-10 text-center text-white relative">
          <div className="bg-[#147D73] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#147D73]/20 rotate-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Continue your mission of kindness</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-[10px] font-bold text-[#147D73] hover:underline uppercase">Forgot Password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#147D73] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#147D73]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login to Account →'}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-gray-600 font-medium">
            New to Care Fund?{' '}
            <Link to="/register" className="text-[#147D73] font-bold hover:underline transition-all">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="bg-[#147D73]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#147D73] text-3xl">🔑</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Forgot Password?</h3>
              <p className="text-gray-500 text-sm mt-2">Enter your registered email address and we'll send you a link to reset your password.</p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={modalLoading || !forgotEmail}
                className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#147D73]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {modalLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <div className="text-center mb-6">
              <div className="bg-[#147D73]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#147D73] text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Set New Password</h3>
              <p className="text-gray-500 text-sm mt-2">Please create a new password for your account.</p>
            </div>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={resetData.password}
                    onChange={(e) => setResetData({...resetData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#147D73] transition-colors"
                    tabIndex={-1}
                  >
                    {showResetPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showResetConfirm ? 'text' : 'password'}
                    className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={resetData.password_confirmation}
                    onChange={(e) => setResetData({...resetData, password_confirmation: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#147D73] transition-colors"
                    tabIndex={-1}
                  >
                    {showResetConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                disabled={modalLoading}
                className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#147D73]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {modalLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="bg-[#147D73]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-[#147D73] w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Verifikasi Perangkat</h3>
              <p className="text-gray-500 text-sm mt-2">Kami telah mengirimkan 6 digit kode OTP ke email Anda untuk memverifikasi login dari perangkat baru ini.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Kode OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#147D73]/20 focus:bg-white transition-all text-center tracking-[0.5em] text-2xl font-black text-slate-800"
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-[#147D73] hover:bg-[#0F655C] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#147D73]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
