import React from 'react';

const FormInput = ({ label, type = 'text', placeholder, onChange, required = true }) => {
  return (
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
};

export default FormInput;
