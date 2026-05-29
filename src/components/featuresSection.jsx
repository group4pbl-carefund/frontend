import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FeaturesSection = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/program-categories');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setFeatures(data);
        }
      } catch (err) {
        console.error('Failed to fetch features:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  return (
    <section className="bg-white py-24 px-8">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
          Mengapa Memilih CareFund?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed md:text-base">
          Kepercayaan Anda adalah prioritas kami. Kami membangun ekosistem donasi digital berbasis kejujuran.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 font-medium">
          Memuat fitur...
        </div>
      ) : features.length > 0 ? (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center px-4">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 text-[#60C9B3]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#0F172A]">
                {feature.name || feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default FeaturesSection;