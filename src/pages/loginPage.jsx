import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    //passing login dulu backend belum beres
    /*
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
    //   email: formData.email,
    //  password: formData.password
    //});

    localStorage.setItem('token', response.data.token);

    alert('Login Success! Welcome to Care Fund');
    window.location.href = '/';
    */
    //pass login
    localStorage.setItem('token', 'token');
    alert('Login Success! Welcome to Care Fund');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Header Hitam */}
        <div className="bg-[#1a1a1a] p-8 text-center text-white relative">
          <div className="bg-[#2ea391] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white">🛡️</span>
          </div>
          <h2 className="text-xl font-bold">Login to Care Fund</h2>
          <p className="text-gray-400 text-sm">Continue your mission of kindness</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Email Address</label>
              <input
                type="email"
                className="w-full bg-gray-100 p-3 rounded-xl outline-none"
                placeholder="name@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Password</label>
              <input
                type="password"
                className="w-full bg-gray-100 p-3 rounded-xl outline-none"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button className="w-full bg-[#2ea391] text-white py-3 rounded-xl font-bold">
              Login to Account →
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            New to Care Fund?{' '}
            <Link to="/register" className="text-[#2ea391] font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;