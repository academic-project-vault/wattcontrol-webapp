# WattControl - Virtual Energy Metering & Automatic Billing System

🌐 **Bahasa / Language:** **🇮🇩 Bahasa Indonesia** | [🇬🇧 English](README.en.md)

---

## Tim Pengembang

| Nama Anggota | NIM | Peran & Tanggung Jawab |
| :--- | :--- | :--- |
| **Noval Fitriadi** | A11.2024.15659 | Project Manager & UI/UX Designer |
| **Baraza Nandian Syah** | A11.2024.15640 | System Analyst & Frontend Developer |
| **Yonazahran Yoga Meinendra Rizky** | A11.2024.15673 | Backend Developer & DevSecOps |

---

## Latar Belakang & Solusi
Pada rumah kos dengan sistem sewa *all-in* dan daya terpasang terbatas (2.200 VA), penggunaan perangkat berdaya besar yang tidak dilaporkan (seperti panci listrik, *magicom*, teko pemanas air, dan setrika) sering memicu tagihan PLN melonjak dan MCB pusat *trip*.

WattControl menyelesaikan masalah tersebut tanpa biaya pemasangan *smart meter* fisik melalui:
* **Kuota Adil Per Kamar:** Pembatasan pemakaian seragam sebesar **100 kWh per kamar/bulan**.
* **Batch Input Meteran Bulanan:** Pencatatan angka kWh meter fisik secara kolektif di akhir bulan oleh pengelola kos (Admin).
* **Engine Kalkulasi Otomatis:** Perhitungan pemakaian, kelebihan kuota, dan nominal denda secara instan.
* **Generator Nota WhatsApp:** Pembuatan format tagihan otomatis siap salin (*clipboard*) untuk dikirim langsung ke penghuni kos.

---

## Fitur Utama
1. **Manajemen Master Data Kamar:** Pengelolaan status hunian (`Terisi` / `Kosong`), identitas penghuni, dan nomor WhatsApp.
2. **Halaman Batch Input Meteran:** Form pencatatan angka indikator kWh akhir bulan untuk seluruh kamar dalam satu tampilan.
3. **Engine Kalkulasi & Status Indikator:**
   * **Pemakaian:** `Meteran Baru - Meteran Lama`
   * **Kelebihan Kuota:** `Pemakaian - 100 kWh`
   * **Denda:** `Kelebihan kWh × Tarif PLN (Rp1.444,70 / kWh)`
   * **Indikator Visual Dashboard:**
     * 🟢 **AMAN:** Pemakaian `≤ 80 kWh` (≤ 80% kuota)
     * 🟡 **SIAGA:** Pemakaian `> 80 kWh` hingga `100 kWh`
     * 🔴 **OVER LIMIT:** Pemakaian `> 100 kWh`
4. **Generator Nota Penagihan WhatsApp:** Tombol **"Salin Nota WA"** untuk menyalin rincian tagihan secara otomatis.
5. **Riwayat & Status Pembayaran:** Pelacakan riwayat tagihan bulanan dan pembaruan status (`Belum Lunas` / `Lunas`).

---

## Tech Stack & Infrastruktur
* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js (REST API)
* **Database:** MySQL / MariaDB
* **Deployment & Hosting:** Vercel / Render
* **Design & Prototyping:** Figma

---

## Arsitektur Keamanan & DevSecOps
Sebagai bagian dari praktik *Secure Software Development Life Cycle* (SSDLC), repositori ini menerapkan standar keamanan berikut:
* **Automated CI/CD Security Scanning:** Pemindaian otomatis pada setiap *Pull Request* menggunakan **Gitleaks** (*Secret Detection*), **Trivy** (*Dependency & Vulnerability Scan*), dan **Semgrep** (*Static Application Security Testing*).
* **Branch Protection:** *Branch* `main` dilindungi dari *direct push* dan mewajibkan lolos pemeriksaan keamanan sebelum penggabungan kode.
* **Environment Isolation:** Manajemen kredensial database dan konfigurasi sensitif dipisahkan sepenuhnya melalui variabel lingkungan (`.env`) dan tidak pernah disimpan di dalam kontrol versi.

---

## Cara Menjalankan Proyek (Local Development)

### 1. Clone Repositori
```bash
git clone https://github.com
cd wattcontrol-webapp
```

### 2. Konfigurasi Environment Variable
Salin file contoh konfigurasi dan sesuaikan dengan kredensial database lokal Anda:
```bash
cp .env.example .env
```

### 3. Instalasi Dependensi & Jalankan Aplikasi
*(Sesuaikan perintah di bawah ini dengan struktur folder `frontend` dan `backend` pada repositori)*
```bash
# Masuk ke direktori backend / frontend dan install paket
npm install

# Jalankan server development
npm run dev
```

---

## Lisensi
Proyek ini dikembangkan untuk keperluan akademik pada mata kuliah Manajemen Proyek Teknologi Informasi (MPTI) - Universitas Dian Nuswantoro.
