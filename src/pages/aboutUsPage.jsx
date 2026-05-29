import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Globe, 
  Target, 
  Compass, 
  Sparkles, 
  Mail, 
  Award,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

const AboutUsPage = () => {
  return (
    <MainLayout>
      <div className="bg-[#F4F7F6] min-h-screen text-slate-800 font-sans">
        
        {/* 1. Hero Section */}
        <section className="relative bg-[#111827] text-white py-24 md:py-32 px-6 overflow-hidden">
          <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,145,135,0.15),transparent_50%)] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 text-xs font-bold text-[#60C9B3] mb-6 animate-in slide-in-from-top duration-500">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Kenali Kami Lebih Dekat</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
              Menyambung Tangan Kebaikan <br />
              <span className="text-[#60C9B3] bg-gradient-to-r from-[#60C9B3] to-teal-300 bg-clip-text text-transparent">Secara Transparan &amp; Berdampak</span>
            </h1>
            
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Care Fund adalah jembatan filantropi digital modern yang menghubungkan kebaikan hati para donatur dengan kebutuhan nyata masyarakat marjinal di seluruh pelosok Indonesia.
            </p>
          </div>
        </section>

        {/* 2. Vision & Mission Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Visual Left Accent */}
          <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-teal-50 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Visi &amp; Misi Utama</h2>
            
            <div className="space-y-8">
              {/* Vision */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-[#147D73]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1.5">Visi Platform</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Menjadi wadah filantropi digital terdepan di Indonesia yang dipercaya karena transparansi radikal, kecepatan penyaluran, dan keberlanjutan dampak positif program edukasi bagi komunitas.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-[#147D73]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1.5">Misi Platform</h4>
                  <ul className="list-disc pl-4 text-xs text-gray-500 space-y-1.5 leading-relaxed">
                    <li>Membangun teknologi donasi yang super-aman, kredibel, dan transparan dari pelacakan dana hingga realisasi.</li>
                    <li>Mengedukasi masyarakat melalui artikel informatif agar tidak hanya mendapat bantuan finansial namun juga ilmu pemberdayaan mandiri.</li>
                    <li>Berkolaborasi aktif dengan relawan lokal untuk menyeleksi dan memverifikasi program kemanusiaan yang berhak dibantu.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive stats / story intro */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#147D73] uppercase tracking-widest">SIAPA KAMI</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Kami percaya donasi bukan sekadar nominal uang, melainkan tentang membangun harapan baru.
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Didirikan oleh para praktisi teknologi dan pegiat sosial, Care Fund lahir untuk mendobrak batasan filantropi tradisional. Kami mendapati bahwa masalah terbesar dalam donasi publik adalah keraguan akan ke mana dana tersebut berlabuh. 
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Oleh sebab itu, kami menghadirkan transparansi audit 100%, sistem KYC (Know Your Customer) yang ketat bagi pembuat kampanye, serta edukasi berkelanjutan. Kami percaya bahwa pemberdayaan masyarakat sejati tercapai ketika donasi berpadu dengan edukasi yang mencerahkan.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div>
                <h4 className="text-3xl font-black text-[#147D73]">10K+</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Donatur Aktif</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <h4 className="text-3xl font-black text-[#147D73]">Rp 2.4 M</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Dana Tersalurkan</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <h4 className="text-3xl font-black text-[#147D73]">150+</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Kampanye Sukses</p>
              </div>
            </div>
          </div>

        </section>







        {/* 6. Call to Action (CTA) Section */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-[#147D73] to-[#2EAF9B] rounded-[48px] p-8 md:p-16 text-white text-center shadow-xl relative overflow-hidden group">
            {/* Ambient visual background glow */}
            <div className="absolute left-[-20%] top-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all duration-700"></div>
            
            <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                Mari Bersama Menghadirkan Perubahan
              </h2>
              <p className="text-teal-50 text-xs md:text-sm font-medium leading-relaxed mb-8 max-w-lg">
                Sekecil apa pun donasi atau keterlibatan Anda, hal itu dapat membuka peluang kehidupan yang jauh lebih baik bagi mereka yang membutuhkan bantuan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/donasi">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#147D73] hover:bg-teal-50 text-xs font-extrabold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                    Mulai Berdonasi Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/buat-kampanye">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 text-xs font-extrabold rounded-2xl transition-all active:scale-95">
                    Buat Galang Dana
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
};

export default AboutUsPage;
