# 🚀 TrackHub — Notion-Style Life & Financial Tracker

TrackHub adalah aplikasi pelacak personal modern dengan antarmuka **Notion Database aesthetic** yang dirancang khusus untuk berjalan cepat dan responsif di handphone (**PWA**) maupun laptop, terintegrasi langsung secara dua arah ke **Google Sheets**.

---

## ✨ Fitur Utama

### 1. 💼 Modul Job Seeker Tracker
- **Kanban Board View**: Kolom visual berdasarkan status (`Applied`, `Interview`, `Offer`, `Rejected`, `Bookmarked`) dengan status changer cepat & efek selebrasi confetti saat mendapatkan *Offer*.
- **Notion Table View**: Tabel database interaktif lengkap dengan pencarian nama perusahaan/posisi/lokasi, filter status, pengurutan (*sorting*), serta link ke CV dan portal lowongan.
- **Scorecards & Analytics**: Menghitung otomatis metrik dari sheet Anda (Total Lamaran, Menunggu Kabar, Tahap Wawancara, Tawaran Diterima, Rasio Tanggapan / *Response Rate*).
- **Detail Modal**: Catat pertanyaan interview, jadwal wawancara, ekspektasi gaji, kontak recruiter, dan evaluasi diri.

### 2. 💰 Modul Tracking Keuangan (Personal Finance)
- **Ringkasan Arus Kas**: Total Pemasukan, Total Pengeluaran, dan Sisa Saldo Kas Bersih secara real-time.
- **Pencatatan Cepat (Quick Entry)**: Modal input cepat untuk mencatat Pemasukan, Pengeluaran, dan Transfer antar dompet (BCA, Mandiri, GoPay, Tunai, dll) dengan format Rupiah otomatis.
- **ID Transaksi Otomatis**: ID unik (contoh: `TX-20261112-XXXX`) dibuat otomatis oleh sistem tanpa perlu diketik manual.
- **Tabel Riwayat Transaksi**: Pencarian, filter per jenis transaksi, dan aksi hapus yang aman.

### 3. 🔒 Keamanan Personal (PIN Passcode)
- Proteksi layar kunci PIN 6-digit ala aplikasi m-Banking.
- Sesi aman tersimpan di HP Anda dengan tombol Kunci (*Lock*) sekali klik.
- PIN default awal: `123456` (dapat diubah kapan saja di menu Pengaturan).

### 4. 📱 Mobile First & Progressive Web App (PWA)
- Tampilan responsif dengan *bottom navigation bar* yang nyaman dijangkau jempol.
- Dapat di-*install* langsung ke layar utama HP (iOS / Android) tanpa address bar browser.
- Mendukung Dark Mode & Light Mode khas palet Notion.

---

## 🗂️ Integrasi Google Sheets

Aplikasi terhubung ke spreadsheet Anda:
- **Tab 1: `Sheet1`** ➔ Data Lamaran Pekerjaan (kompatibel 100% dengan data yang sudah ada).
- **Tab 2: `Keuangan_Transaksi`** ➔ Tab baru yang otomatis dibuat saat mencatat transaksi pertama.

### Cara Menghubungkan Google Sheet (1 Menit):
1. Buka spreadsheet Anda di Google Drive.
2. Klik menu **Extensions (Ekstensi)** ➔ **Apps Script**.
3. Buka file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), salin semua kodenya dan tempel di editor Apps Script.
4. Klik **Deploy** ➔ **New deployment** ➔ pilih jenis **Web app**.
   - *Execute as*: Me (email Anda).
   - *Who has access*: Anyone (Siapa saja).
5. Salin URL Web App yang dihasilkan (format `https://script.google.com/macros/s/.../exec`).
6. Buka menu **Pengaturan** di aplikasi TrackHub, tempel URL tersebut, lalu klik **Uji Koneksi** & **Simpan**.

*(Panduan bergambar lebih lengkap ada di folder [google-apps-script/README.md](./google-apps-script/README.md))*

---

## 🌐 Cara Mengaktifkan GitHub Pages

Aplikasi ini sudah dilengkapi dengan otomatisasi **GitHub Actions** ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)).

Untuk mengaktifkannya:
1. Masuk ke repository ini di GitHub: `https://github.com/hikalputra12/tracking-app`.
2. Klik menu **Settings** ➔ di sidebar kiri klik **Pages**.
3. Pada bagian **Build and deployment** ➔ **Source**, pilih **GitHub Actions**.
4. Selesai! Setiap kali Anda melakukan git push ke branch `main`, GitHub akan otomatis meng-compile dan mempublikasikan website Anda ke:
   ```
   https://hikalputra12.github.io/tracking-app/
   ```

---

## 🛠️ Pengembangan Lokal

```bash
# Install dependensi
npm install

# Jalankan server lokal
npm run dev

# Build untuk produksi
npm run build
```
