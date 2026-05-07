import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
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

  // 2. This function handles moving from Account -> KYC
  const handleNextStep = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return alert("Passwords do not match!");
    }

    // For the demo/frontend flow, we move to step 2 directly
    setCurrentStep(2);
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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">KYC Verification</h2>
            <p className="text-gray-500 text-sm mb-8">Please upload your ID Card to verify your identity.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 mb-8 bg-gray-50">
              <p className="text-gray-400 italic">ID Upload Placeholder (KTP/Passport)</p>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full bg-[#2ea391] text-white py-4 rounded-xl font-bold"
            >
              Finish Registration
            </button>
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