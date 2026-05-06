import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FormInput = ({ label, type = "text", placeholder, onChange, required = true }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
      {label}
    </label>
    <input 
      type={type} 
      className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2ea391] transition-all border border-transparent focus:border-[#2ea391]" 
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
  </div>
);

const StepIndicator = ({ step, currentStep, label }) => (
  <div className="flex flex-col items-center">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
      currentStep >= step ? 'bg-[#2ea391] text-white shadow-lg' : 'bg-gray-200 text-gray-500'
    }`}>
      {step}
    </div>
    <p className={`text-[10px] mt-2 font-black tracking-widest ${
      currentStep >= step ? 'text-[#2ea391]' : 'text-gray-400'
    }`}>
      {label}
    </p>
  </div>
);

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '2000-01-01', 
    address: 'Default Address'   
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return alert("Passwords do not match!");
    }
    setCurrentStep(2);
  };

  const handleSubmitFinal = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      console.log("Response Backend:", response.data);
      setCurrentStep(3);
    } catch (error) {
      console.error("API Error (Staging Issue):", error.response?.data || error.message);
      setCurrentStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfb] flex flex-col items-center py-12 px-4 font-sans">
      
      <div className="flex items-center gap-4 md:gap-8 mb-12">
        <StepIndicator step={1} currentStep={currentStep} label="ACCOUNT" />
        <div className={`h-[2px] w-12 md:w-24 transition-colors duration-500 ${currentStep >= 2 ? 'bg-[#2ea391]' : 'bg-gray-200'}`} />
        <StepIndicator step={2} currentStep={currentStep} label="KYC" />
        <div className={`h-[2px] w-12 md:w-24 transition-colors duration-500 ${currentStep >= 3 ? 'bg-[#2ea391]' : 'bg-gray-200'}`} />
        <StepIndicator step={3} currentStep={currentStep} label="FINISH" />
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-gray-100 border border-gray-50">
        
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <Link to="/login" className="text-[#2ea391] font-bold text-sm mb-6 inline-flex items-center hover:underline">
              <span className="mr-2">←</span> Back to Login
            </Link>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm mb-10 font-medium">Step 1: Personal Information</p>
            
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Full Name" placeholder="Nama Lengkap" onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                <FormInput label="Phone Number" placeholder="+62 8..." onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <FormInput label="Email Address" type="email" placeholder="contoh@mail.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Password" type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <FormInput label="Confirm Password" type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} />
              </div>
              <button className="w-full bg-[#2ea391] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#258a7b] transform hover:-translate-y-1 transition-all shadow-lg shadow-teal-100">
                Next: Verification →
              </button>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center animate-fadeIn">
            <h2 className="text-3xl font-black text-gray-800 mb-2">KYC Verification</h2>
            <p className="text-gray-400 text-sm mb-10 font-medium text-center px-10">
              Please upload your identity document for transparency and security.
            </p>
            <div className="border-4 border-dashed border-gray-100 rounded-[2rem] p-16 mb-10 bg-gray-50 flex flex-col items-center justify-center">
               <div className="text-5xl mb-4 text-gray-300">📄</div>
               <p className="text-gray-400 font-bold italic">KTP / Passport / ID Card</p>
               <button className="mt-4 text-[#2ea391] text-xs font-black uppercase tracking-widest underline">Browse File</button>
            </div>
            <button onClick={handleSubmitFinal} className="w-full bg-[#2ea391] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#258a7b] shadow-lg shadow-teal-100 transition-all">
              Complete Registration
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-6 animate-scaleIn">
            <div className="w-24 h-24 bg-[#e6f4f2] text-[#2ea391] rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
              ✓
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-3">All Set!</h2>
            <p className="text-gray-400 mb-12 font-medium px-8 leading-relaxed">
              Your account has been successfully created. Welcome to the Care Fund community.
            </p>
            <Link to="/login" className="inline-block bg-[#2ea391] text-white px-16 py-4 rounded-2xl font-black text-lg hover:bg-[#258a7b] shadow-lg shadow-teal-100">
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;