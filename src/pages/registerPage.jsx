import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../utils/api';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '2000-01-01',
    address: 'Default Address'
  });

  const [nik, setNik] = useState('');
  const [idImage, setIdImage] = useState(null);
  const [idPreview, setIdPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };

  // 2. This function handles moving from Account -> KYC
  const handleNextStep = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return Swal.fire({
        title: 'Gagal!',
        text: 'Kata sandi tidak cocok!',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#2ea391'
      });
    }

    // For the demo/frontend flow, we move to step 2 directly
    setCurrentStep(2);
  };

  const handleSubmitFinal = async (e) => {
    if (e) e.preventDefault();
    if (!nik.trim() || nik.length < 16) {
      return Swal.fire({
        title: 'Peringatan!',
        text: 'Nomor NIK KTP harus terdiri dari 16 digit angka!',
        icon: 'warning',
        confirmButtonText: 'Kembali',
        confirmButtonColor: '#2ea391'
      });
    }

    setLoading(true);
    try {
      // 1. Register User
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirm_password,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        gender: 'other' // default gender
      };

      const response = await api.post('/register', payload);
      const token = response.data.data.access_token;
      const user = response.data.data.user;

      // Save credentials returned from successful registration
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 2. Create User Identity (KTP KYC Record)
      await api.post('/user-identities', {
        user_id: user.id,
        identity_type: 'KTP',
        identity_number: nik,
        identity_image: `uploads/ktp_${user.id}.jpg` // Simulate KTP file path
      });

      await Swal.fire({
        title: 'Pendaftaran Berhasil!',
        text: 'Akun Anda dan data verifikasi KTP telah sukses didaftarkan!',
        icon: 'success',
        confirmButtonText: 'Selesai',
        confirmButtonColor: '#2ea391'
      });

      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      const validationErrors = error.response?.data?.errors;
      let errorMsg = error.response?.data?.message || 'Pendaftaran gagal. Silakan coba kembali.';
      
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        errorMsg = validationErrors[firstErrorKey][0];
      }

      Swal.fire({
        title: 'Gagal Mendaftar!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#2ea391'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f7] flex flex-col items-center py-10 font-sans">

      {/* Dynamic Stepper Header */}
      <div className="flex items-center gap-10 mb-10">
        <div className="text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto ${currentStep >= 1 ? 'bg-[#2ea391] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <p className={`text-xs mt-1 font-bold ${currentStep >= 1 ? 'text-[#2ea391]' : 'text-gray-400'}`}>ACCOUNT</p>
        </div>
        <div className={`h-[2px] w-20 ${currentStep >= 2 ? 'bg-[#2ea391]' : 'bg-gray-300'}`}></div>
        <div className="text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto ${currentStep >= 2 ? 'bg-[#2ea391] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <p className={`text-xs mt-1 font-bold ${currentStep >= 2 ? 'text-[#2ea391]' : 'text-gray-400'}`}>KYC</p>
        </div>
        <div className={`h-[2px] w-20 ${currentStep >= 3 ? 'bg-[#2ea391]' : 'bg-gray-300'}`}></div>
        <div className="text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto ${currentStep >= 3 ? 'bg-[#2ea391] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <p className={`text-xs mt-1 font-bold ${currentStep >= 3 ? 'text-[#2ea391]' : 'text-gray-400'}`}>FINISH</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl p-10 shadow-sm border border-gray-100">

        {/* STEP 1: ACCOUNT INFORMATION */}
        {currentStep === 1 && (
          <>
            <Link to="/login" className="text-gray-500 text-sm mb-4 inline-block">← Back</Link>
            <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
            <p className="text-gray-500 text-sm mb-8">Please enter your details to create an account.</p>
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Full Name</label>
                  <input type="text" className="w-full bg-gray-100 p-3 rounded-xl outline-none" placeholder="John Doe"
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Phone Number</label>
                  <input type="text" className="w-full bg-gray-100 p-3 rounded-xl outline-none" placeholder="+62 812..."
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Email Address</label>
                <input type="email" className="w-full bg-gray-100 p-3 rounded-xl outline-none" placeholder="john.doe@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Password</label>
                  <input type="password" className="w-full bg-gray-100 p-3 rounded-xl outline-none" placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Confirm Password</label>
                  <input type="password" className="w-full bg-gray-100 p-3 rounded-xl outline-none" placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} required />
                </div>
              </div>
              <button className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold transition-all">
                Continue to KYC Verification →
              </button>
            </form>
          </>
        )}

        {/* STEP 2: KYC VERIFICATION */}
        {currentStep === 2 && (
          <div>
            <button 
              onClick={() => setCurrentStep(1)} 
              className="text-gray-500 text-sm mb-4 inline-block hover:opacity-75 transition-opacity"
            >
              ← Back to Account Info
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">KYC Verification</h2>
            <p className="text-gray-500 text-sm mb-8">Please enter your national ID details and upload your KTP Card.</p>
            
            <form onSubmit={handleSubmitFinal} className="space-y-6 text-left">
              {/* NIK Input Field */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Nomor Induk Kependudukan (NIK - 16 Digit)
                </label>
                <input 
                  type="text" 
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-100 p-4 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2ea391]/20 border border-transparent focus:border-[#2ea391] font-bold text-gray-800 tracking-widest text-center text-lg animate-in" 
                  placeholder="317101xxxxxxxxxx"
                  required 
                />
              </div>

              {/* ID Upload Field */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Foto Kartu Tanda Penduduk (KTP)
                </label>
                
                <input 
                  type="file" 
                  id="ktp-file-input" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  required={!idPreview}
                />

                <label 
                  htmlFor="ktp-file-input"
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    idPreview 
                      ? 'border-[#2ea391] bg-teal-50/10' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {idPreview ? (
                    <div className="relative w-full flex flex-col items-center animate-in zoom-in duration-200">
                      <img 
                        src={idPreview} 
                        alt="KTP Preview" 
                        className="max-h-48 rounded-xl object-contain shadow-md mb-4"
                      />
                      <span className="text-xs font-bold text-[#2ea391] bg-teal-50 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors">
                        Ganti Foto KTP
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-bold text-gray-700 text-sm mb-1">Klik untuk Pilih Foto KTP</p>
                      <p className="text-xs text-gray-400">Mendukung format JPG, JPEG, PNG</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !idPreview || nik.length < 16}
                className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#258778] active:scale-[0.98] transition-all shadow-md shadow-[#2ea391]/10 mt-8 animate-in"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses Pendaftaran...
                  </span>
                ) : (
                  'Selesaikan & Daftar Akun →'
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: FINISH */}
        {currentStep === 3 && (
          <div className="text-center py-10">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
            <p className="text-gray-500 mb-10">Welcome to Care Fund. Your account has been created.</p>
            <Link to="/login" className="bg-[#2ea391] text-white px-10 py-4 rounded-xl font-bold">
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;