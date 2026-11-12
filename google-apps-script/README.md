# Panduan Pemasangan Google Apps Script (Hanya 1 Menit)

Ikuti langkah-langkah mudah berikut untuk menghubungkan Google Sheets Anda ke aplikasi TrackHub:

### Langkah 1: Buka Google Apps Script
1. Buka spreadsheet Anda: [Job Application & Interview Tracker](https://docs.google.com/spreadsheets/d/1SuemDrT6nbkoFR2fsMhP-ebHDj3F_pcvl3Wa-xqNMLA/edit).
2. Di menu atas, klik **Extensions (Ekstensi)** ➔ **Apps Script**.

### Langkah 2: Salin Kode
1. Hapus semua teks yang ada di editor Apps Script (misal `function myFunction() { ... }`).
2. Buka file [`Code.gs`](./Code.gs) di repository ini, lalu **salin (copy) semua isinya** dan **tempel (paste)** ke editor Apps Script.
3. Klik tombol ikon **Save (Simpan / Disket)** atau tekan `Ctrl + S`.

### Langkah 3: Mengatur PIN Rahasia (100% Aman & Tidak Terlihat di GitHub)
Agar PIN rahasia Anda tidak pernah tertulis dalam kode publik di GitHub:
- Di editor Apps Script, pada dropdown fungsi di samping tombol **Run**, pilih fungsi **`setupSecretPin`**.
- Ubah angka `"123456"` di dalam fungsi tersebut sesuai 6 digit PIN rahasia yang Anda inginkan.
- Klik tombol **Run**. 
- PIN Anda sekarang tersimpan di brankas terenkripsi Google (*Script Properties*) dan tidak akan pernah bocor ke publik!

### Langkah 4: Deploy sebagai Web App
1. Di pojok kanan atas, klik tombol biru **Deploy** ➔ pilih **New deployment (Penerapan baru)**.
2. Di jendela yang muncul, klik ikon roda gigi ⚙️ di samping *"Select type"* dan pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description**: `TrackHub API v1`
   - **Execute as (Jalankan sebagai)**: `Me (email@gmail.com)` *(akun Google Anda)*
   - **Who has access (Siapa yang memiliki akses)**: `Anyone (Siapa saja)`
     > **Catatan Keamanan**: Pilihan *"Anyone"* ini aman karena akses ke data tetap **dikunci oleh PIN rahasia Anda**. Tanpa PIN yang cocok, script akan menolak siapapun yang mencoba mengakses.
4. Klik tombol **Deploy**.
5. Jika Google meminta izin (*Authorize Access*):
   - Klik **Authorize access** ➔ pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced (Lanjutan)** di bagian bawah ➔ klik **Go to Untitled project (unsafe) / Buka project**.
   - Klik **Allow (Izinkan)**.

### Langkah 5: Ambil URL Web App
1. Salin **Web App URL** yang diberikan oleh Google (formatnya seperti: `https://script.google.com/macros/s/AKfycb.../exec`).
2. Masukkan URL tersebut ke menu **Pengaturan (Settings)** di aplikasi TrackHub di HP/Laptop Anda.

Selesai! Tab `Keuangan_Transaksi` akan otomatis terbuat saat transaksi pertama dicatat, dan data lamaran kerja Anda akan langsung tersinkronisasi secara real-time.
