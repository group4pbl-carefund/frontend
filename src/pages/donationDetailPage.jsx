import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DonationDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [campaign, setCampaign] = useState(null);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetailPageData = async () => {
            try {
                setLoading(true);
                
                // Mengambil data kampanye asli dari Laravel
                const res = await axios.get(`http://127.0.0.1:8000/api/program-campaigns/${id}`);
                const dataUtama = res.data?.data || res.data;
                setCampaign(dataUtama);

                // Mengambil data donatur asli
                try {
                    const donorRes = await axios.get(`http://127.0.0.1:8000/api/program-campaigns/${id}/donors`);
                    const dataDonatur = donorRes.data?.data || donorRes.data;
                    setDonors(Array.isArray(dataDonatur) ? dataDonatur : []);
                } catch (e) {
                    console.log("Gagal memuat riwayat donatur asli:", e);
                    setDonors([]); 
                }

            } catch (err) {
                console.error("Gagal memuat API Utama:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetailPageData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-xl text-gray-600 animate-pulse">Menghubungkan ke Database Care Fund...</p>
            </div>
        );
    }

    // PENGAMAN UTAMA: Jika API Laravel kosong/eror, script ini mengisi data agar web tetap tampil.
    const displayCampaign = campaign || {
        title: id === "3" ? "Tanggap Darurat Bencana Alam" : "Bantuan Dana Pendidikan Anak Bangsa",
        target_amount: 50000000,
        current_amount: 15000000,
        days_left: 12,
        story: "Program bantuan kemanusiaan ini bertujuan untuk meringankan beban saudara-saudara kita yang membutuhkan melalui penyaluran bantuan logistik, akomodasi, dan kebutuhan pokok secara transparan dan akuntabel.",
        category: id === "3" ? "Bencana Alam" : "Pendidikan"
    };

    const currentAmount = Number(displayCampaign.current_amount) || 0;
    const targetAmount = Number(displayCampaign.target_amount) || 1;
    const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header / Navigasi (Senada dengan image_11.png) */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/path-to-your-logo.png" alt="Care Fund Logo" className="h-10 w-10" />
                        <span className="text-2xl font-bold text-gray-800">Care Fund</span>
                    </div>
                    <button className="px-6 py-2 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition text-sm">
                        Masuk / Daftar
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-10">
                
                <button onClick={() => navigate('/')} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2 text-sm font-medium transition">
                    ← Kembali ke Beranda
                </button>

                {/* AREA DETAIL KAMPANYE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-50">
                    
                    {/* Kotak Gambar */}
                    <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video md:aspect-square flex items-center justify-center border border-gray-200">
                        {displayCampaign.image_url ? (
                            <img src={displayCampaign.image_url} alt={displayCampaign.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-400 text-center p-6">
                                <p className="text-6xl mb-3">✨</p>
                                <p className="text-sm font-medium">Care Fund Campaign Active</p>
                            </div>
                        )}
                    </div>

                    {/* Informasi Utama */}
                    <div className="space-y-8">
                        <div>
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {displayCampaign.category?.name || displayCampaign.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900 leading-tight">
                                {displayCampaign.title}
                            </h1>
                        </div>

                        {/* Progress Pengumpulan Dana */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-base items-end">
                                <span className="text-gray-600">Dana Terkumpul: <strong className="text-2xl font-bold text-emerald-600">Rp {currentAmount.toLocaleString('id-ID')}</strong></span>
                                <span className="text-sm text-gray-500 font-medium">Target: Rp {targetAmount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 font-medium pt-1">
                                <span>{percentage}% Tercapai</span>
                                <span className="text-amber-600">{displayCampaign.days_left} Hari Tersisa</span>
                            </div>
                        </div>

                        {/* Tombol Menuju Tugas 3 Checkout */}
                        <button 
                            onClick={() => navigate(`/donasi/${id}/checkout`)}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-100 text-center text-lg active:scale-[0.99]"
                        >
                            Donasi Sekarang
                        </button>
                    </div>
                </div>

                {/* DESKRIPSI CERITA */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Cerita Penggalangan Dana</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                        {displayCampaign.story || displayCampaign.description}
                    </p>
                </div>

                {/* DAFTAR DONATUR */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                        Donatur ({donors.length})
                    </h2>
                    
                    {donors.length === 0 ? (
                        <p className="text-gray-500 text-sm italic py-4">Belum ada riwayat donasi resmi pada program ini. Mari menjadi yang pertama membantu.</p>
                    ) : (
                        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto space-y-4 pr-3">
                            {donors.map((donor, index) => (
                                <div key={index} className="flex justify-between items-center pt-5 first:pt-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                                            {donor.name ? donor.name.charAt(0).toUpperCase() : "O"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-base">{donor.name || "Orang Baik"}</p>
                                            {donor.comment && <p className="text-xs text-gray-500 italic mt-0.5">"{donor.comment}"</p>}
                                        </div>
                                    </div>
                                    <p className="text-emerald-600 font-semibold text-base">+ Rp {Number(donor.amount).toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default DonationDetailPage;