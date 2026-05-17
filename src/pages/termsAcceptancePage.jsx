import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, CheckSquare, Square, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const TermsAcceptancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTc] = useState(() => {
    // Retrieve the active T&C version from localStorage
    const storedVersions = localStorage.getItem('carefund_tc_versions');
    let active = null;
    
    if (storedVersions) {
      try {
        const versions = JSON.parse(storedVersions);
        active = versions.find(v => v.status === 'active');
      } catch (e) {
        console.error('Error parsing versions', e);
      }
    }

    // Default fallback if not initialized in localStorage yet
    if (!active) {
      active = {
        version: 'v2.0.0',
        title: 'Syarat dan Ketentuan v2.0.0 - Pembaruan Kebijakan Transparansi & Biaya',
        content: `### 1. Ketentuan Layanan Pembaruan
Kami telah memperbarui Syarat dan Ketentuan kami untuk meningkatkan transparansi penyaluran dana serta kepatuhan terhadap regulasi perlindungan data pribadi (UU PDP).

### 2. Sistem Transparansi & Distribusi
Setiap donasi kini dilengkapi dengan pelaporan real-time yang dapat diakses melalui Dashboard Komunitas. Biaya administrasi platform disesuaikan menjadi flat 3.5% untuk semua kampanye non-bencana, sedangkan kampanye bencana tetap 0% (tanpa potongan).

### 3. Kebijakan Privasi Baru (Kepatuhan UU PDP)
Kami berkomitmen melindungi data pribadi Anda. Data sensitif seperti foto KTP untuk verifikasi KYC dienkripsi menggunakan standar industri dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan eksplisit Anda.

### 4. Mekanisme Audit Publik
Care Fund berhak menunjuk auditor independen untuk mengaudit laporan keuangan kampanye secara berkala demi menjamin dana disalurkan tepat sasaran.`,
        highlights: [
          'Penurunan biaya admin platform dari 5% menjadi 3.5% flat.',
          'Peningkatan keamanan data KYC sesuai regulasi UU PDP terbaru.',
          'Implementasi mekanisme audit independen untuk transparansi penuh.',
          'Pelaporan real-time di Dashboard Komunitas untuk setiap donasi.'
        ]
      };
    }
    return active;
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Get redirect path
  const redirectPath = location.state?.from || '/dashboard';

  const handleAccept = () => {
    if (!isChecked || !activeTc) return;

    // Trigger success micro-animation
    setShowCelebration(true);

    setTimeout(() => {
      // 1. Update user object in localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.acceptedTermsVersion = activeTc.version;
        localStorage.setItem('user', JSON.stringify(user));

        // 2. Add log to carefund_tc_acceptances
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
      }

      // 3. Navigate back to where they wanted to go
      navigate(redirectPath, { replace: true });
    }, 1500); // 1.5 seconds delay for celebration animation
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!activeTc) {
    return (
      <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#149187] animate-spin" />
          <p className="text-sm font-semibold text-teal-800">Memuat Dokumen Persetujuan...</p>
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
          <div className="flex items-center gap-2 text-xs font-bold text-[#149187] bg-teal-50 px-4 py-2 rounded-full">
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
                <ShieldCheck className="w-6 h-6 text-[#60C9B3]" />
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
                    <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center text-[10px] font-black text-[#60C9B3] shrink-0 mt-0.5 border border-[#60C9B3]/20">
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
                <span className="text-[9px] font-black text-[#149187] bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
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
                activeTc.content.split('\n\n').map((para, i) => {
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
                    <CheckSquare className="w-5 h-5 text-[#149187]" />
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
                    ? 'bg-[#149187] hover:bg-[#0f7c73] shadow-teal-900/10 cursor-pointer' 
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
