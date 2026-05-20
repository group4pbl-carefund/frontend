import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../utils/api';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    country: ''
  });

  // Step 2: KYC states
  const [nik, setNik] = useState('');
  const [idImage, setIdImage] = useState(null);
  const [idPreview, setIdPreview] = useState('');

  // Step 3: OTP states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown handler
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);

    // Automatically focus next element
    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpValues[index] === '' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  // Step 1 -> Step 2
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
    setCurrentStep(2);
  };

  // Step 2 -> Step 3: Call Register + Create UserIdentity
  const handleSubmitKYC = async (e) => {
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
      // 1. Hit API Register
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirm_password,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        country: formData.country
      };

      const response = await api.post('/register', payload);
      const token = response.data.data.access_token;
      const user = response.data.data.user;



      // Save token dynamically to local storage for Sanctum interceptor
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 2. Hit API UserIdentity (KYC)
      await api.post('/user-identities', {
        user_id: user.id,
        identity_type: 'KTP',
        identity_number: nik,
        identity_image: `uploads/ktp_${user.id}.jpg` // Simulated image storage path
      });

      await Swal.fire({
        title: 'Data Tersimpan!',
        text: 'Akun Anda berhasil dibuat. Silakan verifikasi email Anda.',
        icon: 'success',
        confirmButtonText: 'Lanjutkan',
        confirmButtonColor: '#2ea391'
      });

      setCurrentStep(3); // Go to OTP verification step
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

  // Step 3 -> Step 4: Verify OTP Code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otpValues.join('');
    if (otpCode.length < 6) {
      return Swal.fire({
        title: 'Peringatan!',
        text: 'Harap masukkan 6 digit kode OTP secara lengkap!',
        icon: 'warning',
        confirmButtonText: 'Kembali',
        confirmButtonColor: '#2ea391'
      });
    }

    setLoading(true);
    try {
      await api.post('/verify-otp', {
        email: formData.email,
        otp: otpCode
      });

      await Swal.fire({
        title: 'Verifikasi Berhasil!',
        text: 'Selamat! Akun email Anda telah berhasil diverifikasi.',
        icon: 'success',
        confirmButtonText: 'Lanjutkan',
        confirmButtonColor: '#2ea391'
      });

      setCurrentStep(4); // Finish!
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Verifikasi Gagal!',
        text: error.response?.data?.message || 'Kode OTP salah atau telah kedaluwarsa.',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#2ea391'
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const response = await api.post('/resend-otp', {
        email: formData.email
      });



      await Swal.fire({
        title: 'OTP Dikirim!',
        text: 'Kode OTP baru telah dikirimkan ke email Anda.',
        icon: 'success',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#2ea391'
      });

      setResendTimer(60); // 60s cooldown
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Gagal!',
        text: error.response?.data?.message || 'Gagal mengirim ulang OTP.',
        icon: 'error',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#2ea391'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f7] flex flex-col items-center py-10 font-sans">

      {/* Dynamic 4-Step Stepper Header */}
      <div className="flex items-center gap-6 md:gap-10 mb-10 overflow-x-auto max-w-full px-4 py-2">
        <div className="text-center min-w-[70px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto transition-all ${currentStep >= 1 ? 'bg-[#2ea391] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <p className={`text-[10px] md:text-xs mt-1 font-bold ${currentStep >= 1 ? 'text-[#2ea391]' : 'text-gray-400'}`}>ACCOUNT</p>
        </div>
        <div className={`h-[2px] w-10 md:w-16 ${currentStep >= 2 ? 'bg-[#2ea391]' : 'bg-gray-300'}`}></div>

        <div className="text-center min-w-[70px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto transition-all ${currentStep >= 2 ? 'bg-[#2ea391] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <p className={`text-[10px] md:text-xs mt-1 font-bold ${currentStep >= 2 ? 'text-[#2ea391]' : 'text-gray-400'}`}>KYC</p>
        </div>
        <div className={`h-[2px] w-10 md:w-16 ${currentStep >= 3 ? 'bg-[#2ea391]' : 'bg-gray-300'}`}></div>

        <div className="text-center min-w-[70px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto transition-all ${currentStep >= 3 ? 'bg-[#2ea391] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <p className={`text-[10px] md:text-xs mt-1 font-bold ${currentStep >= 3 ? 'text-[#2ea391]' : 'text-gray-400'}`}>VERIFY</p>
        </div>
        <div className={`h-[2px] w-10 md:w-16 ${currentStep >= 4 ? 'bg-[#2ea391]' : 'bg-gray-300'}`}></div>

        <div className="text-center min-w-[70px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto transition-all ${currentStep >= 4 ? 'bg-[#2ea391] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>4</div>
          <p className={`text-[10px] md:text-xs mt-1 font-bold ${currentStep >= 4 ? 'text-[#2ea391]' : 'text-gray-400'}`}>FINISH</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">

        {/* STEP 1: ACCOUNT INFORMATION */}
        {currentStep === 1 && (
          <>
            <Link to="/login" className="text-gray-500 text-sm mb-4 inline-block hover:opacity-80">← Back to Login</Link>
            <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
            <p className="text-gray-500 text-sm mb-8">Please enter your details to create an account.</p>
            <form onSubmit={handleNextStep} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Full Name</label>
                  <input type="text" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Email Address</label>
                  <input type="email" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Phone Number</label>
                  <input type="text" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="+62 812..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Date of Birth</label>
                  <input type="date" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all text-gray-600"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Gender</label>
                  <select className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all text-gray-600"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Address</label>
                <textarea className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all resize-none h-24" placeholder="Your full residential address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">City</label>
                  <input type="text" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="Jakarta"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">State/Province</label>
                  <input type="text" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="DKI Jakarta"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Country</label>
                  <input type="text" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="Indonesia"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Password</label>
                  <input type="password" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Confirm Password</label>
                  <input type="password" className="w-full bg-gray-100 p-3.5 rounded-xl outline-none focus:bg-gray-50 border border-transparent focus:border-[#2ea391] transition-all" placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} required />
                </div>
              </div>
              <button className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold transition-all hover:bg-[#258778] active:scale-[0.99]">
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

            <h2 className="text-2xl font-bold text-gray-800 text-center">KYC Verification</h2>
            <p className="text-gray-500 text-sm mb-8 text-center">Please enter your national ID details and upload your KTP Card.</p>

            <form onSubmit={handleSubmitKYC} className="space-y-6 text-left">
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
                  className="w-full bg-gray-100 p-4 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2ea391]/20 border border-transparent focus:border-[#2ea391] font-bold text-gray-800 tracking-widest text-center text-lg transition-all"
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
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${idPreview
                      ? 'border-[#2ea391] bg-teal-50/10'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  {idPreview ? (
                    <div className="relative w-full flex flex-col items-center">
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
                className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#258778] active:scale-[0.98] transition-all shadow-md shadow-[#2ea391]/10 mt-8"
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
                  'Lanjutkan ke Verifikasi Email →'
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: EMAIL OTP VERIFICATION */}
        {currentStep === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Email Verification</h2>
            <p className="text-gray-500 text-sm mt-1 mb-8">
              Kami telah mengirimkan 6-digit kode OTP ke email <strong className="text-gray-700">{formData.email}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-8">
              {/* 6 OTP Input Boxes */}
              <div className="flex justify-center gap-3">
                {otpValues.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-14 bg-gray-100 rounded-xl text-center text-xl font-bold border border-transparent focus:bg-white focus:border-[#2ea391] focus:ring-2 focus:ring-[#2ea391]/20 outline-none transition-all"
                  />
                ))}
              </div>



              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || otpValues.includes('')}
                  className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#258778] active:scale-[0.98] transition-all shadow-md shadow-[#2ea391]/10"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Akun →'}
                </button>

                <div className="text-sm text-gray-500">
                  Tidak menerima kode?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-[#2ea391] font-bold">Kirim ulang dalam {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#2ea391] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Kirim Ulang Kode
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: FINISH */}
        {currentStep === 4 && (
          <div className="text-center py-10">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
            <p className="text-gray-500 mb-10">Welcome to Care Fund. Your account and email has been verified and registered.</p>
            <Link to="/login" className="bg-[#2ea391] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#258778] transition-all shadow-md shadow-[#2ea391]/20">
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;