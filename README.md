# 📱 Carefund PBL - Frontend Documentation

> Dokumentasi lengkap aplikasi Frontend Carefund berbasis React Vite dengan integrasi Axios ke API Backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- NPM atau Yarn
- Backend API (sudah berjalan di `localhost:8000`)

### Installation

1. **Clone Repository (Jika belum)**
```bash
git clone <repository_url>
cd project_pbl_carefund/frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
Ubah atau pastikan base URL API sudah benar di dalam konfigurasi API Anda (biasanya di `src/utils/api.js`). Secara bawaan mengarah ke `http://127.0.0.1:8000/api`.

4. **Start Development Server**
```bash
npm run dev
```

Server frontend akan berjalan di: `http://localhost:5173`

---

## 🛠 Tech Stack & Libraries

Proyek ini dibangun menggunakan teknologi modern:
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Routing:** React Router DOM
- **HTTP Client:** Axios (dengan Interceptor JWT Token)
- **Modals/Alerts:** SweetAlert2
- **Charts:** Chart.js & React-Chartjs-2
- **Editor:** TinyMCE React

---

## 🔐 API Integration & Authentication

Aplikasi ini menggunakan Axios dengan Interceptor untuk secara otomatis menyisipkan **JWT Bearer Token** ke setiap request yang membutuhkan autentikasi (seperti profil, checkout donasi, dll).

Konfigurasi Interceptor berada di `src/utils/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Menambahkan token ke header secara otomatis
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

Cara Mengakses API di dalam Component:
```javascript
import api from '../utils/api';

// GET Data
const res = await api.get('/program-campaigns');

// POST Data
const res = await api.post('/donations', {
    program_id: 16,
    amount: 100000,
});
```

---

## 📚 Struktur Halaman (Routes)

Aplikasi memiliki sistem routing yang telah disesuaikan (berada di `src/App.jsx` atau router file).

| Endpoint Frontend | Halaman / Komponen | Keterangan |
|-------------------|--------------------|------------|
| `/` | `LandingPage` | Halaman utama publik |
| `/login` | `LoginPage` | Halaman autentikasi |
| `/register` | `RegisterPage` | Pendaftaran akun baru |
| `/programs` | `ProgramsPage` | Daftar semua program galang dana |
| `/donasi/:id` | `DonationDetailPage` | Detail kampanye, list donatur, & tombol donasi |
| `/checkout/:id` | `CheckoutPage` | Proses pembayaran donasi & QRIS |
| `/user-profile` | `UserProfilePage` | Dashboard user, riwayat donasi & sertifikat |
| `/buat-kampanye` | `CreateCampaignPage` | Form pengajuan program baru |
| `/manage-campaign`| `ManageCampaignPage` | Kelola kampanye milik user (Admin/Campaigner) |
| `/education` | `EducationPage` | Portal artikel edukasi filantropi |
| `/education/:id` | `ArticleDetail` | Baca detail artikel edukasi |

---

## 🧩 Komponen Utama yang Reusable (src/components)

1. **`Navbar` / `Footer` / `MainLayout`**
   - Mengatur navigasi publik & deteksi sesi user untuk tombol login/logout.
2. **`DonationCard`**
   - Komponen kartu standar untuk menampilkan gambar kampanye, judul, progress bar target dana, dan sisa hari.
3. **`DonationHistoryItem`**
   - List item untuk menampilkan riwayat donasi, nominal, kategori, dan tombol detail.
4. **`StatCard`**
   - Kartu statistik mini untuk menampilkan total donasi & angka dampak (impact).

---

## 📦 Panduan Modifikasi & Build

### 1. Menambah Halaman Baru
1. Buat file komponen baru di folder `src/pages/`.
2. Tambahkan komponen layout dasar (`<MainLayout>`).
3. Daftarkan path route baru Anda di file Route utama (`App.jsx` atau `main.jsx`).

### 2. Membangun untuk Production
Jalankan perintah ini saat siap di-deploy:
```bash
npm run build
```
Vite akan membuat folder `dist/` yang siap di-host di Vercel, Netlify, atau Nginx.
