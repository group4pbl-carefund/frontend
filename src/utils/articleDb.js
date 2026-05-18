let articles = [
  {
    id: 1,
    title: 'Cara Berdonasi dengan Aman di Era Digital',
    subtitle: 'Quick guide to secure transactions',
    category: 'Security',
    catColor: 'bg-teal-50 text-teal-600',
    authorName: 'Anisa Rahmawati',
    authorAvatar: 'https://ui-avatars.com/api/?name=Anisa+Rahmawati&background=147D73&color=fff',
    date: '24 Okt 2024',
    views: '3,421',
    status: 'PUBLISHED',
    statusColor: 'bg-emerald-100 text-emerald-700',
    featured: true,
    metaDescription: 'Panduan lengkap mengenai langkah-langkah keamanan saat melakukan donasi online agar terhindar dari penipuan.',
    content: '<p>Meningkatnya kesadaran sosial di era digital telah mempermudah siapapun untuk berkontribusi bagi kemanusiaan. Namun, kemudahan ini juga menuntut kewaspadaan lebih tinggi terhadap potensi penipuan digital yang semakin canggih.</p><p>Trust atau kepercayaan adalah pondasi dari setiap gerakan filantropi. Di Care Fund, kami percaya bahwa setiap rupiah yang Anda donasikan harus sampai kepada mereka yang membutuhkan dengan transparan dan aman.</p><p>Berikut adalah beberapa langkah praktis menjaga keamanan:</p><ul><li>Verifikasi URL situs web (pastikan dimulai dengan https://).</li><li>Gunakan metode pembayaran yang terintegrasi dan resmi.</li><li>Cek laporan transparansi tahunan organisasi tersebut.</li><li>Hindari memberikan informasi pribadi yang berlebihan seperti PIN atau password.</li></ul>'
  },
  {
    id: 2,
    title: 'Mengapa KYC Sangat Penting Bagi Donatur?',
    subtitle: 'Step-by-step verification process',
    category: 'Regulation',
    catColor: 'bg-blue-50 text-blue-600',
    authorName: 'Marco Polo',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marco+Polo&background=3b82f6&color=fff',
    date: '22 Okt 2024',
    views: '1,890',
    status: 'DRAFT',
    statusColor: 'bg-gray-100 text-gray-600',
    featured: false,
    metaDescription: 'Memahami standar identifikasi untuk transparansi dana bantuan.',
    content: '<p>KYC (Know Your Customer) adalah langkah krusial untuk memastikan bahwa identitas penerima manfaat dan penggalang dana terverifikasi dengan benar.</p><p>Dengan proses verifikasi dokumen KTP dan swafoto yang aman, kita dapat bersama-sama mencegah risiko penyalahgunaan platform dan menjamin akuntabilitas penyaluran dana kemanusiaan secara berkala.</p>'
  },
  {
    id: 3,
    title: 'Teknologi Blockchain dalam Transparansi Donasi',
    subtitle: 'Overview of modern gateway options',
    category: 'Payment',
    catColor: 'bg-orange-50 text-orange-600',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=f97316&color=fff',
    date: '19 Okt 2024',
    views: '5,102',
    status: 'PUBLISHED',
    statusColor: 'bg-emerald-100 text-emerald-700',
    featured: false,
    metaDescription: 'Metode pembayaran yang didukung dan biaya pemrosesan.',
    content: '<p>Teknologi buku besar terdistribusi atau blockchain menawarkan transparansi audit real-time terbaik untuk donasi digital.</p><p>Dengan sistem pencatatan transaksi terdesentralisasi, setiap aliran dana donatur dapat ditelusuri dengan sangat presisi dan tanpa bisa diubah oleh pihak ketiga, menciptakan tingkat kepercayaan tertinggi pada program donasi publik.</p>'
  }
];

export const getArticles = () => {
  return [...articles];
};

export const getArticleById = (id) => {
  const numericId = parseInt(id, 10);
  return articles.find(a => a.id === numericId) || null;
};

export const addArticle = (articleData) => {
  const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
  const newArticle = {
    id: newId,
    views: '0',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(articleData.authorName || 'Admin')}&background=147D73&color=fff`,
    catColor: articleData.category === 'Security' 
      ? 'bg-teal-50 text-teal-600' 
      : articleData.category === 'Regulation' 
        ? 'bg-blue-50 text-blue-600' 
        : 'bg-orange-50 text-orange-600',
    statusColor: articleData.status === 'PUBLISHED' 
      ? 'bg-emerald-100 text-emerald-700' 
      : 'bg-gray-100 text-gray-600',
    ...articleData
  };
  articles.unshift(newArticle);
  return newArticle;
};

export const updateArticle = (id, updatedFields) => {
  const numericId = parseInt(id, 10);
  articles = articles.map(a => {
    if (a.id === numericId) {
      return {
        ...a,
        ...updatedFields,
        catColor: updatedFields.category === 'Security' 
          ? 'bg-teal-50 text-teal-600' 
          : updatedFields.category === 'Regulation' 
            ? 'bg-blue-50 text-blue-600' 
            : 'bg-orange-50 text-orange-600',
        statusColor: updatedFields.status === 'PUBLISHED' 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-gray-100 text-gray-600'
      };
    }
    return a;
  });
  return getArticleById(numericId);
};

export const deleteArticle = (id) => {
  const numericId = parseInt(id, 10);
  articles = articles.filter(a => a.id !== numericId);
  return true;
};

export const getStats = () => {
  const totalViews = articles.reduce((sum, a) => sum + parseInt((a.views || '0').replace(/[^0-9]/g, ''), 10), 0);
  const categories = Array.from(new Set(articles.map(a => a.category))).length;
  return {
    totalArticles: articles.length,
    totalViews: totalViews.toLocaleString('id-ID'),
    categoriesCount: categories
  };
};

export const incrementViews = (id) => {
  const numericId = parseInt(id, 10);
  articles = articles.map(a => {
    if (a.id === numericId) {
      const current = parseInt((a.views || '0').replace(/[^0-9]/g, ''), 10);
      return {
        ...a,
        views: (current + 1).toLocaleString('id-ID')
      };
    }
    return a;
  });
};
