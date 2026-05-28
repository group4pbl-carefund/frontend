import { formatDate } from './format';

let campaigns = [
  {
    id: 1,
    title: "Bantuan Pangan Korban Banjir",
    user: "Relawan Kita",
    docStatus: "KTP Terverifikasi",
    category: "Bencana Alam",
    target: 50000000,
    collected: 41000000, // 82% of 50M
    daysLeft: 15,
    donorsCount: 1402,
    status: 'approved', // Active & running
    imageSrc: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
    description: "Inisiatif ini dirancang untuk menyalurkan paket sembako dan makanan instan darurat kepada korban banjir bandang di wilayah pesisir.",
    recipientName: "Masyarakat Pesisir Terdampak",
    bankName: "Bank BCA",
    accountNumber: "8820129481",
    accountOwner: "Yayasan Relawan Kita",
    updates: []
  },
  {
    id: 2,
    title: "Beasiswa Anak Yatim Piatu",
    user: "Yayasan Amanah",
    docStatus: "Dokumen Yayasan Lengkap",
    category: "Pendidikan",
    target: 120000000,
    collected: 90000000, // 75%
    daysLeft: 60,
    donorsCount: 450,
    status: 'approved',
    imageSrc: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    description: "Program beasiswa berkelanjutan untuk membiayai sekolah formal dan bimbingan belajar anak-anak panti asuhan.",
    recipientName: "Anak-anak Asuh Yayasan Amanah",
    bankName: "Bank Mandiri",
    accountNumber: "139002930219",
    accountOwner: "Yayasan Amanah Utama",
    updates: []
  },
  {
    id: 3,
    title: "Air Bersih untuk Desa Terpencil NTT",
    user: "Sahabat Air Indonesia",
    docStatus: "Terverifikasi",
    category: "Kesehatan",
    target: 75000000,
    collected: 72750000, // 97%
    daysLeft: 10,
    donorsCount: 389,
    status: 'approved',
    imageSrc: "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=600&q=80",
    description: "Membangun sumur bor dan saluran air bersih untuk 3 desa di Nusa Tenggara Timur yang mengalami kesulitan akses air bersih.",
    recipientName: "Warga Desa Terpencil NTT",
    bankName: "Bank BNI",
    accountNumber: "9901847192",
    accountOwner: "Yayasan Sahabat Air",
    updates: []
  },
  {
    id: 4,
    title: "Paket Sembako untuk Lansia Dhuafa",
    user: "CareFund Care",
    docStatus: "Terverifikasi",
    category: "Sosial",
    target: 20000000,
    collected: 12000000, // 60%
    daysLeft: 22,
    donorsCount: 110,
    status: 'approved',
    imageSrc: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    description: "Penyaluran paket sembako bulanan untuk 100 lansia yang hidup sebatang kara di wilayah pinggiran kota.",
    recipientName: "Lansia Dhuafa Pinggiran Kota",
    bankName: "Bank BRI",
    accountNumber: "021948194829",
    accountOwner: "CareFund Peduli Lansia",
    updates: []
  }
];

export const getCampaigns = () => {
  return [...campaigns];
};

export const getPendingCampaigns = () => {
  return campaigns.filter(c => c.status === 'pending');
};

export const addCampaign = (campaignData) => {
  const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
  const newCampaign = {
    id: newId,
    user: campaignData.user || "Demo Campaigner",
    docStatus: "KTP & Dokumen Terunggah",
    collected: 0,
    daysLeft: 30,
    donorsCount: 0,
    status: 'pending',
    updates: [],
    ...campaignData
  };
  campaigns.unshift(newCampaign);
  return newCampaign;
};

export const updateCampaignStatus = (id, status) => {
  const numericId = parseInt(id, 10);
  campaigns = campaigns.map(c => {
    if (c.id === numericId) {
      return { ...c, status };
    }
    return c;
  });
  return true;
};

export const addCampaignUpdate = (id, updateText) => {
  const numericId = parseInt(id, 10);
  campaigns = campaigns.map(c => {
    if (c.id === numericId) {
      const newUpdate = {
        id: Date.now(),
        date: formatDate(new Date(), 'short'),
        text: updateText
      };
      return {
        ...c,
        updates: [newUpdate, ...(c.updates || [])]
      };
    }
    return c;
  });
  return true;
};

export const updateCampaignDays = (id, newDays) => {
  const numericId = parseInt(id, 10);
  campaigns = campaigns.map(c => {
    if (c.id === numericId) {
      return { ...c, daysLeft: newDays };
    }
    return c;
  });
  return true;
};

export const getCampaignById = (id) => {
  const numericId = parseInt(id, 10);
  return campaigns.find(c => c.id === numericId) || null;
};

