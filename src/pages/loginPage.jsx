import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // HARDCODED BYPASS FOR TESTING
    if (formData.email === 'admin@carefund.com' && formData.password === 'admin123') {
      localStorage.setItem('token', 'dummy-admin-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        full_name: 'Admin CareFund',
        email: 'admin@carefund.com',
        role: 'admin'
      }));
      alert('Login Success (Admin Bypass)!');
      window.location.href = '/admin';
      return;
    }

    if (formData.email === 'user@carefund.com' && formData.password === 'user123') {
      localStorage.setItem('token', 'dummy-user-token');
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        full_name: 'Regular User',
        email: 'user@carefund.com',
        role: 'user',
        acceptedTermsVersion: 'v1.0.0'
      }));
      alert('Login Success (User Bypass)!');
      window.location.href = '/dashboard';
      return;
    }

    // ACTUAL API LOGIN
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      alert('Login Success! Welcome to Care Fund');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials or use bypass.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-[#1a1a1a] p-10 text-center text-white relative">
          <div className="bg-[#2ea391] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2ea391]/20 rotate-3">
            <span className="text-white text-2xl">🛡️</span>
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
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#2ea391]/20 focus:bg-white transition-all"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[10px] font-bold text-[#2ea391] hover:underline uppercase">Forgot Password?</Link>
              </div>
              <input
                type="password"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#2ea391]/20 focus:bg-white transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#2ea391] hover:bg-[#258a7b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#2ea391]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login to Account →'}
            </button>
          </form>

          {/* Bypass Info Tooltip/Hint */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 text-center tracking-tighter">Testing Credentials (Bypass)</p>
            <div className="flex justify-between text-[11px] text-gray-600 px-2">
              <span>Admin: admin@carefund.com</span>
              <span>Pass: admin123</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 px-2 mt-1">
              <span>User: user@carefund.com</span>
              <span>Pass: user123</span>
            </div>
          </div>

          <p className="text-center text-sm mt-8 text-gray-600 font-medium">
            New to Care Fund?{' '}
            <Link to="/register" className="text-[#2ea391] font-bold hover:underline transition-all">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
