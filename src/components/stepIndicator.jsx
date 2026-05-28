import React from 'react';

const StepIndicator = ({ step, currentStep, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        currentStep >= step ? 'bg-[#147D73] text-white shadow-lg' : 'bg-gray-200 text-gray-500'
      }`}>
        {step}
      </div>
      <p className={`text-[10px] mt-2 font-black tracking-widest ${
        currentStep >= step ? 'text-[#147D73]' : 'text-gray-400'
      }`}>
        {label}
      </p>
    </div>
  );
};

export default StepIndicator;
