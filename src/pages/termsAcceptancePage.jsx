import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, CheckSquare, Square, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../utils/api';

const TermsAcceptancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTc, setActiveTc] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get redirect path
  const redirectPath = location.state?.from || '/dashboard';

  useEffect(() => {
    const fetchActiveTerms = async () => {
      try {
        const response = await api.get('/term-versions');
        // Response format is { success: true, data: [...] }
        const versions = response.data?.data || response.data;
        
        if (Array.isArray(versions) && versions.length > 0) {
          // Sort descending by version_id to get the latest version
          const sorted = [...versions].sort((a, b) => b.version_id - a.version_id);
          const latest = sorted[0];
          
          setActiveTc({
            version_id: latest.version_id,
            version: latest.version_number,
            title: `Syarat & Ketentuan Pembaruan (${latest.version_number})`,
            content: latest.content,
            highlights: [
              'Penyesuaian tata kelola platform CareFund.',
              'Peningkatan transparansi penyaluran dana donasi.',
              'Kepatuhan regulasi perlindungan data pribadi (UU PDP).',
              'Pelaporan real-time pada dashboard terpadu.'
            ]
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Gagal memuat T&C dari API:', err);
        setActiveTc(null);
      }
      setLoading(false);
    };

    fetchActiveTerms();
  }, []);

  const handleAccept = async () => {
    if (!isChecked || !activeTc) return;

    // Trigger success micro-animation
    setShowCelebration(true);

    // Get logged in user details
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // 1. Post to API
        try {
          const payload = {
            user_id: user.id || user.user_id || 1, // Fallback to 1 if not present
            version_id: activeTc.version_id || 2,  // Fallback to 2 if not present
            ip_address: '127.0.0.1' // client simulated IP
          };
          await api.post('/user-terms-agreements', payload);
        } catch (apiErr) {
          console.warn('Gagal mencatat persetujuan ke database API:', apiErr);
          // Don't block the user in generalized mode if API fails
        }

        // 2. Update local state
        user.accepted_terms_version = activeTc.version;
        localStorage.setItem('user', JSON.stringify(user));

        const storedAcceptances = localStorage.getItem('carefund_tc_acceptances') || '[]';
        const acceptances = JSON.parse(storedAcceptances);
        
        const newAcceptance = {
          id: Date.now(),
          userName: user.full_name || 'Regular User',
          userEmail: user.email || 'user@carefund.com',
          version: activeTc.version,
          acceptedAt: new Date().toISOString()
        };

        acceptances.unshift(newAcceptance);
        localStorage.setItem('carefund_tc_acceptances', JSON.stringify(acceptances));
      } catch (err) {
        console.error('Error handling accept:', err);
      }
    }

    setTimeout(() => {
      // Navigate back
      navigate(redirectPath, { replace: true });
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#147D73] animate-spin" />
          <p className="text-sm font-semibold text-teal-800">Memuat Dokumen Persetujuan...</p>
        </div>
      </div>
    );
  }

  if (!activeTc) {
    return (
      <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <h2 className="text-xl font-bold text-slate-800">Gagal Memuat Dokumen</h2>
          <p className="text-sm font-semibold text-red-800">Tidak dapat memuat data Syarat & Ketentuan. Harap periksa koneksi atau hubungi admin.</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#147D73] text-white rounded-xl text-xs font-bold hover:bg-[#0F655C]">Coba Lagi</button>
          <button onClick={handleLogout} className="mt-2 text-xs font-bold text-slate-500 hover:text-slate-700 underline">Logout Sementara</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2F1] via-[#F4F7F6] to-[#E0F2F1] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Graphic Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {showCelebration ? (
        /* Celebratory Success Interstitial */
        <div className="w-full max-w-2xl bg-white rounded-[40px] p-12 text-center shadow-2xl border border-teal-50 animate-in zoom-in duration-300 flex flex-col items-center justify-center relative">
          <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-6 shadow-md shadow-emerald-200 rotate-6 animate-bounce">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Persetujuan Diterima!</h2>
          <p className="text-slate-500 font-medium max-w-md mb-8">
            Terima kasih telah menyetujui Syarat &amp; Ketentuan versi {activeTc.version}. Kami berkomitmen menjaga integritas dan transparansi setiap aksi kebaikan Anda.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#147D73] bg-teal-50 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mengarahkan Anda kembali...</span>
          </div>
        </div>
      ) : (
        /* Main Terms Agreement Panel */
        <div className="w-full max-w-4xl bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row relative">
          
          {/* Left Hero Sidebar: Information & Changes Summary */}
          <div className="lg:w-2/5 bg-[#1E293B] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5 rotate-3">
                <ShieldCheck className="w-6 h-6 text-[#147D73]" />
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-4">
                Pembaruan Syarat &amp; Ketentuan
              </h2>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                Kami telah memperbarui dokumen hukum platform untuk memperkuat transparansi penggalangan dana dan menyelaraskan dengan UU Perlindungan Data Pribadi terbaru.
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">POIN UTAMA PERUBAHAN:</p>
                {activeTc.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center text-[10px] font-black text-[#147D73] shrink-0 mt-0.5 border border-[#147D73]/20">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{hl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout bypass */}
            <div className="mt-12 lg:mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Bukan Anda?</span>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 font-bold hover:underline transition-colors"
              >
                Logout dari Akun
              </button>
            </div>

          </div>

          {/* Right Area: Document Text & Form Actions */}
          <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between bg-white">
            
            {/* Header info */}
            <div className="mb-6 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] font-black text-[#147D73] bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  VERSI {activeTc.version}
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-2 tracking-tight">
                  Tinjau Dokumen Hukum
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0 pt-1">
                <BookOpen className="w-4 h-4 text-slate-300" />
                <span>2 menit baca</span>
              </div>
            </div>

            {/* Terms and Conditions full text box */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 h-[320px] overflow-y-auto mb-6 text-xs text-slate-700 leading-relaxed space-y-4 shadow-inner">
              {activeTc.content ? (
                activeTc.content.replace(/\\n/g, '\n').split('\n\n').map((para, i) => {
                  if (para.startsWith('### ')) {
                    return <h4 key={i} className="text-sm font-bold text-gray-800 pt-2">{para.replace('### ', '')}</h4>;
                  } else if (para.startsWith('- ') || para.startsWith('* ')) {
                    return (
                      <ul key={i} className="list-disc pl-4 space-y-1 my-1">
                        {para.split('\n').map((li, j) => (
                          <li key={j}>{li.replace(/^[-*]\s+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })
              ) : (
                <p className="text-gray-400 italic">Memuat konten syarat &amp; ketentuan...</p>
              )}
            </div>

            {/* Interactive Acceptance Form */}
            <div className="space-y-6">
              
              {/* Checkbox wrapper */}
              <div 
                onClick={() => setIsChecked(!isChecked)}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                  isChecked 
                  ? 'bg-teal-50/50 border-teal-200 shadow-sm' 
                  : 'bg-white border-gray-150 hover:bg-gray-50/50'
                }`}
              >
                <div className="shrink-0 mt-0.5 transition-colors">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#147D73]" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Saya menyetujui Syarat &amp; Ketentuan terbaru
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-normal">
                    Dengan mencentang ini, Anda menyatakan setuju secara hukum terhadap pembaruan sistem transparansi, audit keuangan, dan pengolahan data pribadi Care Fund.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3.5 border border-gray-200 text-xs font-bold text-gray-500 rounded-2xl hover:bg-gray-50 hover:text-gray-700 transition-all"
                >
                  Kembali ke Beranda
                </button>
                <button
                  disabled={!isChecked}
                  onClick={handleAccept}
                  className={`flex-grow py-3.5 rounded-2xl font-extrabold text-xs text-white text-center shadow-lg transition-all active:scale-[0.98] ${
                    isChecked 
                    ? 'bg-[#147D73] hover:bg-[#0F655C] shadow-teal-900/10 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                  }`}
                >
                  Setujui &amp; Lanjutkan Akses →
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TermsAcceptancePage;
