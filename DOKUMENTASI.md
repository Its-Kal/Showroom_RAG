# Dokumentasi Detail Proyek Showroom Mobil

Dokumen ini memberikan penjelasan mendalam untuk setiap file penting dalam proyek, menjelaskan apa fungsinya dan bagaimana cara kerjanya.

---

## Bab 1: File Konfigurasi & Publik

File-file ini mengatur dasar-dasar proyek dan berfungsi sebagai gerbang masuk bagi browser.

### `package.json`
- **Apa itu?** File "kartu identitas" proyek. Berisi nama proyek, versi, dan yang terpenting, daftar semua *dependency* (library pihak ketiga seperti React) dan *script* (perintah seperti `npm start`).
- **Cara Kerjanya:** Ketika Anda menjalankan `npm install`, Node.js membaca file ini untuk mengetahui library apa saja yang perlu diunduh ke folder `node_modules`. Ketika Anda menjalankan `npm start`, Node.js melihat ke bagian `"scripts"` untuk menemukan perintah yang sebenarnya harus dijalankan.

### `public/index.html`
- **Apa itu?** Satu-satunya halaman HTML di seluruh aplikasi. Ini adalah kerangka kosong tempat aplikasi React Anda akan "disuntikkan".
- **Cara Kerjanya:** Saat Anda membuka situs, browser pertama kali memuat file ini. Di dalamnya ada elemen `<div id="root"></div>`. File `src/index.tsx` kemudian akan menemukan `div` ini dan memerintahkan React untuk merender seluruh komponen aplikasi di dalamnya. Judul halaman, ikon, dan tag meta juga diatur di sini.

### `public/favicon.ico` & `public/robots.txt`
- **`favicon.ico`**: Ikon kecil yang muncul di tab browser.
- **`robots.txt`**: File teks sederhana yang memberi tahu bot mesin pencari (seperti Googlebot) halaman mana yang boleh dan tidak boleh mereka kunjungi di situs Anda.

---

## Bab 2: Titik Masuk Aplikasi (`src`)

File-file ini bertanggung jawab untuk memulai dan menstrukturkan aplikasi React.

### `src/index.tsx`
- **Apa itu?** Titik masuk (entry point) dari aplikasi React. Ini adalah file JavaScript/TypeScript pertama yang dieksekusi.
- **Cara Kerjanya:** Kode di sini melakukan dua hal utama:
  1. Menggunakan `ReactDOM.createRoot(...)` untuk menunjuk ke elemen `<div id="root">` di `index.html`.
  2. Merender komponen utama aplikasi, yaitu `<App />`, ke dalam root tersebut. Proses ini memulai keseluruhan aplikasi React.

### `src/index.css`
- **Apa itu?** File CSS untuk styling yang paling global.
- **Cara Kerjanya:** File ini diimpor ke dalam `index.tsx`, yang berarti gayanya diterapkan secara global ke seluruh aplikasi. Biasanya digunakan untuk mengatur properti dasar seperti `font-family` atau `margin` pada elemen `body`.

### `src/App.tsx`
- **Apa itu?** Komponen utama yang menjadi "kerangka" atau "layout" dari seluruh situs.
- **Cara Kerjanya:** Komponen ini mengatur struktur tingkat tinggi.
  1. **`<Router>`**: Membungkus semua komponen lain untuk mengaktifkan fungsionalitas routing (berpindah halaman).
  2. **`<Header />`**: Menampilkan header/navigasi yang akan selalu terlihat di semua halaman.
  3. **`<Routes>`**: Bagian dinamis tempat React Router akan menukar komponen halaman (`HomePage`, `AboutPage`, dll.) berdasarkan URL yang sedang aktif.
  4. **`<Footer />`**: Menampilkan footer yang juga akan selalu terlihat.

### `src/App.css`
- **Apa itu?** File CSS utama untuk komponen-komponen aplikasi.
- **Cara Kerjanya:** Diimpor ke dalam `App.tsx` dan berisi sebagian besar styling untuk proyek ini, seperti gaya untuk header, kartu mobil, footer, dll. Kelas CSS yang didefinisikan di sini dapat digunakan oleh komponen mana pun yang merupakan bagian dari `App`.

---

## Bab 3: Halaman (`src/pages`)

Folder ini berisi komponen-komponen yang mewakili satu halaman penuh.

### `src/pages/HomePage.tsx`
- **Apa itu?** Komponen yang mendefinisikan konten dan tata letak dari halaman utama (landing page).
- **Cara Kerjanya:** Komponen ini tidak memiliki banyak logika sendiri. Tugas utamanya adalah mengimpor dan menyusun beberapa komponen "bagian" yang lebih kecil (`Hero`, `FeaturedCars`, `About`) dalam urutan yang benar untuk membentuk halaman utama yang kohesif.

### `src/pages/AboutPage.tsx`
- **Apa itu?** Komponen yang mewakili halaman "Tentang Kami" yang berdiri sendiri.
- **Cara Kerjanya:** Berisi JSX (HTML di dalam JavaScript) untuk menampilkan informasi detail tentang perusahaan. Ini adalah contoh halaman statis sederhana. Ketika URL di browser adalah `/about`, React Router akan menampilkan komponen ini di dalam kerangka `<App />`.

---

## Bab 4: Komponen (`src/components`)

Folder ini berisi blok bangunan UI yang lebih kecil dan dapat digunakan kembali.

### `src/components/Header.tsx`
- **Apa itu?** Komponen untuk bilah navigasi atas.
- **Cara Kerjanya:** Menggunakan komponen `<Link>` dari `react-router-dom` (bukan tag `<a>` biasa). Ketika diklik, `<Link>` memberi tahu React Router untuk mengubah URL dan merender komponen halaman yang sesuai, tanpa perlu me-refresh seluruh halaman web.

### `src/components/Footer.tsx`
- **Apa itu?** Komponen untuk bagian footer bawah.
- **Cara Kerjanya:** Komponen statis sederhana yang hanya menampilkan informasi kontak dan hak cipta.

### `src/components/Hero.tsx`
- **Apa itu?** Komponen "pahlawan" atau banner besar di bagian atas halaman utama.
- **Cara Kerjanya:** Menampilkan gambar latar belakang, judul utama yang menarik, dan tombol *call-to-action* (CTA) untuk menarik perhatian pengunjung.

### `src/components/FeaturedCars.tsx`
- **Apa itu?** Komponen untuk menampilkan galeri mobil unggulan.
- **Cara Kerjanya:**
  1. Memiliki sebuah *array* data mobil (nama, deskripsi, harga, gambar) yang didefinisikan di dalam file.
  2. Menggunakan fungsi `.map()` dari JavaScript untuk melakukan *looping* pada setiap mobil di dalam array.
  3. Untuk setiap mobil, ia merender komponen "kartu" (`<div className="car-card">`) yang menampilkan detail mobil tersebut. Ini adalah pola yang sangat umum di React untuk menampilkan daftar data.

### `src/components/About.tsx`
- **Apa itu?** Komponen "bagian" yang menampilkan ringkasan singkat tentang perusahaan di halaman utama.
- **Cara Kerjanya:** Berbeda dari `AboutPage.tsx`, ini adalah versi ringkas yang dirancang untuk menjadi salah satu bagian dari landing page, bukan halaman yang berdiri sendiri.

---

## Bab 5: Panduan Pengembangan

(Bagian ini tetap sama, berisi panduan praktis untuk menambah halaman baru).

### Alur Super Mudah Menambah Halaman Baru (Contoh: Halaman "Login")

**Langkah 1: Buat File Halaman Baru**
Buat file baru di `src/pages/`, misalnya `LoginPage.tsx`.

**Langkah 2: Daftarkan Rute di `App.tsx`**
Impor halaman baru Anda di `src/App.tsx` dan tambahkan satu baris `<Route>` di dalam `<Routes>`.

**Langkah 3 (Opsional): Tambah Link Navigasi**
Buka `src/components/Header.tsx` dan tambahkan `<Link>` baru ke halaman tersebut.