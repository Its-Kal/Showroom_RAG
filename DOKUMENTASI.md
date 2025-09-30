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

### `src/pages/ChatBot.tsx`
- **Apa itu?** Komponen ini mengimplementasikan fungsionalitas chatbot interaktif yang memungkinkan pengguna berkomunikasi dengan bot untuk mendapatkan rekomendasi mobil.
- **Cara Kerjanya:**
  1.  **Manajemen Pesan:** Menggunakan `useState` untuk menyimpan riwayat percakapan (`messages`) antara pengguna dan bot. Setiap pesan memiliki `sender` (pengguna atau bot) dan `text`.
  2.  **Input Pengguna:** Menggunakan `useState` untuk mengelola teks yang sedang diketik pengguna (`input`) dan `handleSendMessage` untuk mengirim pesan.
  3.  **Interaksi Webhook:** Ketika pengguna mengirim pesan, pesan tersebut dikirim ke URL webhook eksternal (`https://n8n-mihwklraj3fx.bgxy.sumopod.my.id/webhook/...`) menggunakan `fetch` API. Webhook ini bertanggung jawab untuk memproses pesan dan mengembalikan respons dari bot.
  4.  **Status Loading:** `isLoading` state digunakan untuk menunjukkan bahwa bot sedang memproses permintaan, menonaktifkan input dan tombol kirim untuk mencegah pengiriman pesan ganda.
  5.  **Scroll Otomatis:** `useEffect` dan `useRef` digunakan untuk memastikan area obrolan selalu menggulir ke bawah secara otomatis, menampilkan pesan terbaru.
  6.  **Batasan Riwayat:** Konstanta `CHAT_HISTORY_LIMIT` (disetel ke 5) membatasi jumlah pesan yang disimpan dalam riwayat obrolan untuk menjaga performa dan menghindari penggunaan memori yang berlebihan. Hanya 5 pesan terakhir yang akan ditampilkan.
  7.  **Pengecekan Status Webhook:** Saat komponen dimuat, sebuah `useEffect` akan melakukan permintaan `HEAD` ke URL webhook untuk memeriksa ketersediaan koneksi. Status koneksi (`Terhubung`, `Tidak Terhubung`, atau `Memeriksa...`) akan ditampilkan kepada pengguna. Input pesan dan tombol kirim akan dinonaktifkan jika webhook tidak terhubung.
  8.  **Penanganan Error:** Dilengkapi dengan blok `try-catch` untuk menangani potensi kesalahan jaringan atau respons webhook yang tidak valid, memberikan umpan balik yang sesuai kepada pengguna dan memperbarui status koneksi webhook jika terjadi kesalahan.

---

## Bab 4: Komponen (`src/components`)

Folder ini berisi blok bangunan UI yang lebih kecil dan dapat digunakan kembali.

### `src/components/Header.tsx`
- **Apa itu?** Komponen untuk bilah navigasi atas.
- **Cara Kerjanya:** Menggunakan komponen `<Link>` dari `react-router-dom` (bukan tag `<a>` biasa). Ketika diklik, `<Link>` memberi tahu React Router untuk mengubah URL dan merender komponen halaman yang sesuai, tanpa perlu me-refresh seluruh halaman web.

### `src/components/Footer.tsx`
- **Apa itu??** Komponen untuk bagian footer bawah.
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

**DIMAS
create CarDetailPage.tsx
create CarDetail.tsx
change featuredCars.tsx

---

## Bab 6: Backend (FastAPI)

Bagian ini menjelaskan arsitektur dan cara kerja backend API yang dibangun menggunakan FastAPI (Python).

### Gambaran Umum
Backend proyek ini berfungsi sebagai API (Application Programming Interface) yang menyediakan data dan layanan untuk aplikasi frontend (React). Dibangun dengan FastAPI, sebuah kerangka kerja web modern berperforma tinggi untuk Python.

Tugas utamanya adalah:
- Mengelola logika bisnis.
- Berinteraksi dengan database (saat ini menggunakan data dummy dalam memori).
- Menyediakan endpoint yang aman dan terdokumentasi untuk diakses oleh frontend.

### Struktur File
Berikut adalah struktur file di dalam direktori `backend/FastApi`:

- **`main.py`**: File utama yang berisi seluruh logika API, termasuk inisialisasi aplikasi, definisi model data, dan semua endpoint.
- **`requirements.txt`**: File teks yang mendaftar semua pustaka Python yang dibutuhkan oleh proyek. Ini memastikan bahwa setiap pengembang menggunakan versi dependensi yang sama.
- **`venv/`**: Direktori yang berisi *virtual environment* Python. Ini adalah lingkungan terisolasi tempat semua dependensi proyek diinstal, mencegah konflik dengan proyek Python lain di sistem Anda.

### Penyiapan & Instalasi
Untuk menjalankan backend, Anda perlu menyiapkan lingkungan Python dan menginstal dependensi yang diperlukan.

**Langkah 1: Buka Terminal**
Buka terminal atau command prompt pilihan Anda.

**Langkah 2: Navigasi ke Direktori Backend**
Pindah ke direktori tempat backend berada.
```bash
cd c:\uas_showroom\backend\FastApi
```

**Langkah 3: Aktifkan Virtual Environment**
Setiap kali Anda ingin mengerjakan backend, Anda harus mengaktifkan *virtual environment* terlebih dahulu.
```bash
virtualenv\Scripts\activate
```
Setelah aktif, nama prompt di terminal Anda akan diawali dengan `(venv)`.

**Langkah 4: Instal Dependensi**
Gunakan `pip` untuk menginstal semua pustaka yang tercantum di `requirements.txt`.
```bash
pip install -r requirements.txt
```
Perintah ini akan menginstal `fastapi`, `uvicorn`, `pydantic`, dan pustaka lainnya secara otomatis.

### Menjalankan Server
Setelah dependensi terinstal, Anda dapat menjalankan server pengembangan.

```bash
uvicorn main:app --reload
```
- **`uvicorn`**: Perintah untuk menjalankan server ASGI (Asynchronous Server Gateway Interface).
- **`main:app`**: Memberi tahu `uvicorn` untuk mencari objek bernama `app` di dalam file `main.py`.
- **`--reload`**: Opsi ini membuat server secara otomatis me-restart setiap kali Anda menyimpan perubahan pada kode. Sangat berguna selama pengembangan.

Server akan berjalan dan dapat diakses di **`http://127.0.0.1:8000`**.

### Endpoint API
FastAPI secara otomatis menghasilkan dokumentasi interaktif untuk semua endpoint. Anda dapat mengaksesnya melalui browser di:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

Berikut adalah daftar endpoint yang tersedia:

#### `GET /`
- **Deskripsi**: Endpoint root yang memberikan pesan selamat datang. Berguna untuk memeriksa apakah server berjalan dengan benar.
- **Contoh Respons**:
  ```json
  {
    "message": "Welcome to the UAS Showroom API"
  }
  ```

#### `POST /login`
- **Deskripsi**: Mengotentikasi pengguna berdasarkan username dan password. Saat ini menggunakan data dummy.
- **Body Permintaan**:
  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```
- **Respons Sukses (200)**:
  ```json
  {
    "message": "Welcome John Doe! Login successful."
  }
  ```
- **Respons Gagal (401)**:
  ```json
  {
    "detail": "Incorrect username or password"
  }
  ```

#### `GET /items/{item_id}`
- **Deskripsi**: Mengambil detail item (mobil) berdasarkan ID-nya.
- **Parameter Path**:
  - `item_id` (integer): ID unik dari item yang ingin diambil.
- **Respons Sukses (200)**:
  ```json
  {
    "name": "Nama Mobil",
    "description": "Deskripsi mobil.",
    "price": 50000,
    "tax": 5000
  }
  ```
- **Respons Gagal (404)**:
  ```json
  {
    "detail": "Item not found"
  }
  ```

#### `POST /items/`
- **Deskripsi**: Membuat item (mobil) baru.
- **Body Permintaan**:
  ```json
  {
    "name": "Mobil Baru",
    "description": "Deskripsi mobil baru.",
    "price": 75000,
    "tax": 7500
  }
  ```
- **Respons Sukses (200)**: Mengembalikan objek item yang baru saja dibuat.
  ```json
  {
    "name": "Mobil Baru",
    "description": "Deskripsi mobil baru.",
    "price": 75000,
    "tax": 7500
  }
  ```

## Bab 7: Fitur Utama & Alur Kerja (Update Terbaru)

Bagian ini merinci pembaruan besar yang memindahkan logika data ke backend dan memperkenalkan fungsionalitas admin.

### 1. Arsitektur Backend Baru: Manajemen Data Mobil

Sebelumnya, data mobil disimpan langsung di dalam komponen frontend (hardcoded). Ini telah diubah secara fundamental.

- **Sumber Data Tunggal**: File baru `backend/FastApi/cars.json` sekarang menjadi satu-satunya sumber kebenaran (single source of truth) untuk semua data mobil.
- **Pemuatan Data**: Saat server FastAPI dimulai, server akan membaca `cars.json` dan memuat datanya ke dalam memori, divalidasi menggunakan model Pydantic `Car`.
- **Penyimpanan Data**: Setiap kali ada perubahan pada data mobil (membuat, memperbarui, atau menghapus), perubahan tersebut akan langsung disimpan kembali ke file `cars.json`, memastikan persistensi data antar sesi server.

### 2. API CRUD Penuh untuk Mobil

Untuk mendukung manajemen data terpusat, serangkaian endpoint API baru telah dibuat. Endpoint `/items/...` yang lama telah digantikan oleh `/cars/...`.

- **`GET /cars`**: Mengembalikan daftar semua mobil yang ada di `cars.json`.
- **`GET /cars/{car_id}`**: Mengembalikan detail lengkap dari satu mobil berdasarkan `id`-nya.
- **`POST /upload_car`**: Endpoint multifungsi untuk membuat mobil baru.
  - Menerima data mobil (nama, harga, deskripsi) dan file PDF melalui `multipart/form-data`.
  - Membuat entri mobil baru di `cars.json`.
  - Meneruskan file PDF yang diunggah ke webhook eksternal.
- **`PUT /cars/{car_id}`**: Memperbarui informasi mobil yang ada. Menerima data formulir dan memperbarui entri yang sesuai di `cars.json`.
- **`DELETE /cars/{car_id}`**: Menghapus mobil dari `cars.json` berdasarkan `id`-nya.

### 3. Dasbor Admin Fungsional (Frontend)

Halaman `/admin` telah dibuat sebagai pusat kendali untuk mengelola data mobil.

- **Alur Login**: Tombol "Konsultasi AI" di header telah diganti dengan tombol "Login Admin". Tombol ini mengarahkan pengguna ke halaman `/login`. Setelah login berhasil, pengguna secara otomatis diarahkan ke `/admin`.
- **Antarmuka CRUD**: Dasbor admin kini memiliki antarmuka penuh untuk operasi CRUD:
  - **Create**: Formulir di sisi kiri memungkinkan admin untuk menambahkan mobil baru.
  - **Read**: Semua mobil yang ada ditampilkan dalam tata letak kartu yang bersih dan modern di sisi kanan.
  - **Update**: Tombol "Edit" pada setiap kartu mobil akan mengisi formulir dengan data mobil tersebut, memungkinkan admin untuk memperbaruinya.
  - **Delete**: Tombol "Hapus" pada setiap kartu akan memicu permintaan penghapusan setelah konfirmasi.
- **Desain Human-Centered**: Tampilan dasbor telah dirancang ulang dengan fokus pada pengalaman pengguna. Ini mencakup tata letak dua kolom yang jelas, penggunaan kartu untuk visualisasi data, ikon yang intuitif, dan umpan balik (pesan sukses/error) yang jelas.

### 4. Refactoring Komponen Frontend

Sebagai hasil dari pemindahan data ke backend, semua komponen frontend yang sebelumnya menggunakan data dummy lokal kini telah di-refactor:

- **`CollectionSection.tsx`**, **`CarDetailPage.tsx`**, dan **`FeaturedCars.tsx`** sekarang mengambil data yang mereka butuhkan dengan melakukan panggilan `fetch` ke endpoint API backend yang sesuai (`/cars` atau `/cars/{car_id}`).
- Komponen-komponen ini sekarang juga menangani status `loading` dan `error` mereka sendiri, memberikan umpan balik kepada pengguna saat data sedang dimuat atau jika terjadi masalah.

### 5. Alur Otentikasi & Header Dinamis

Untuk meningkatkan pengalaman pengguna dan keamanan, alur otentikasi yang lebih canggih telah diimplementasikan.

- **Manajemen State Terpusat**: Komponen `App.tsx` sekarang bertanggung jawab untuk mengelola status login pengguna (`isLoggedIn`). Status ini disimpan di `sessionStorage` browser, yang memungkinkannya tetap ada (persisten) bahkan setelah pengguna me-refresh halaman, tetapi akan hilang ketika tab browser ditutup.
- **Header yang Adaptif**: Komponen `Header.tsx` sekarang menerima status login dari `App.tsx`. Tampilannya berubah secara dinamis:
  - **Jika Pengguna Login**: Tombol "Login Admin" berubah menjadi tombol "Keluar". Link navigasi "Admin" juga muncul di menu utama.
  - **Jika Pengguna Logout**: Tombol "Login Admin" ditampilkan.
  - **Di Halaman Login**: Jika pengguna belum login dan sedang berada di halaman `/login`, tombol login diganti dengan sapaan "Haloo" untuk memberikan konteks bahwa pengguna sudah berada di tempat yang tepat.
- **Rute Terlindungi**: Rute `/admin` sekarang dilindungi. Jika pengguna yang belum login mencoba mengaksesnya secara langsung, mereka akan secara otomatis dialihkan ke halaman `/login`.

---

## Bab 8: Koneksi Frontend & Backend

Bagian ini menjelaskan bagaimana aplikasi frontend (React) berkomunikasi dengan backend (FastAPI) untuk menampilkan dan mengelola data.

### Arsitektur Terpisah (Decoupled)
Proyek ini menggunakan arsitektur terpisah, yang berarti frontend dan backend adalah dua aplikasi yang independen:
- **Frontend (React)**: Bertanggung jawab atas semua yang dilihat dan diinteraksikan oleh pengguna di browser. Berjalan di `http://localhost:3000`.
- **Backend (FastAPI)**: Bertanggung jawab untuk menyediakan data, mengelola logika bisnis, dan berinteraksi dengan database (file `cars.json`). Berjalan di `http://localhost:8000`.

Pemisahan ini memungkinkan pengembangan dan penskalaan yang independen antara antarmuka pengguna dan logika server.

### Mekanisme Komunikasi
Komunikasi antara keduanya terjadi melalui **permintaan HTTP**, khususnya menggunakan REST API.

1.  **Permintaan dari Frontend**: Ketika frontend perlu menampilkan atau memodifikasi data (misalnya, menampilkan daftar mobil), ia menggunakan fungsi `fetch` yang disediakan oleh browser untuk mengirim permintaan HTTP ke alamat backend.
    ```typescript
    // Contoh di dalam komponen React (misalnya, CollectionSection.tsx)
    const response = await fetch('http://localhost:8000/cars');
    const data = await response.json();
    // 'data' sekarang berisi array objek mobil dari backend
    ```

2.  **Pemrosesan oleh Backend**: Backend FastAPI selalu "mendengarkan" permintaan yang masuk. Ketika permintaan untuk `/cars` diterima, fungsi yang terkait (`get_cars` di `main.py`) dieksekusi. Fungsi ini membaca `cars.json`, mengubahnya menjadi format JSON, dan mengirimkannya kembali sebagai respons HTTP.

3.  **Pentingnya CORS (Cross-Origin Resource Sharing)**: Secara default, browser menerapkan kebijakan keamanan yang melarang halaman web (`http://localhost:3000`) untuk membuat permintaan ke domain atau port yang berbeda (`http://localhost:8000`). Untuk mengatasi ini, backend FastAPI menggunakan `CORSMiddleware`. Konfigurasi ini secara eksplisit memberi tahu browser bahwa permintaan dari `http://localhost:3000` aman dan diizinkan.
    ```python
    # Di dalam backend/FastApi/main.py
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", ...], # Mengizinkan frontend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```

### Contoh Alur Kerja: Menampilkan Detail Mobil
1.  **Pengguna**: Mengklik sebuah mobil di halaman koleksi. URL di browser berubah menjadi `/cars/1`.
2.  **Frontend (React)**: Komponen `CarDetailPage.tsx` dirender. Komponen ini mengambil `carId` (yaitu `1`) dari URL.
3.  **Frontend (React)**: `useEffect` di dalam `CarDetailPage.tsx` dieksekusi, yang memicu panggilan `fetch` ke backend: `fetch('http://localhost:8000/cars/1')`.
4.  **Backend (FastAPI)**: Menerima permintaan `GET` di endpoint `/cars/{car_id}`.
5.  **Backend (FastAPI)**: Mencari mobil dengan `id: 1` di dalam `cars.json`.
6.  **Backend (FastAPI)**: Mengirimkan kembali data mobil yang ditemukan sebagai respons JSON.
7.  **Frontend (React)**: Menerima respons, menyimpannya dalam *state*, dan memperbarui UI untuk menampilkan detail mobil yang sesuai.
