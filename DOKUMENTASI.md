# Dokumentasi Detail Proyek Showroom Mobil

Dokumen ini memberikan penjelasan mendalam untuk setiap file dan direktori penting dalam proyek, menjelaskan apa fungsinya dan bagaimana cara kerjanya.

---

## Bab 1: Konfigurasi & File Publik

File-file ini mengatur dasar-dasar proyek frontend dan berfungsi sebagai gerbang masuk bagi browser.

### `package.json`
- **Apa itu?** File "kartu identitas" proyek. Berisi nama proyek, versi, dan yang terpenting, daftar semua *dependency* (library pihak ketiga seperti React) dan *script* (perintah seperti `npm start`).
- **Cara Kerjanya:** Ketika Anda menjalankan `npm install`, Node.js membaca file ini untuk mengetahui library apa saja yang perlu diunduh ke folder `node_modules`. Ketika Anda menjalankan `npm start`, Node.js melihat ke bagian `"scripts"` untuk menemukan perintah yang sebenarnya harus dijalankan.

### `public/index.html`
- **Apa itu?** Satu-satunya halaman HTML di seluruh aplikasi. Ini adalah kerangka kosong tempat aplikasi React Anda akan "disuntikkan".
- **Cara Kerjanya:** Saat Anda membuka situs, browser pertama kali memuat file ini. Di dalamnya ada elemen `<div id="root"></div>`. File `src/index.tsx` kemudian akan menemukan `div` ini dan memerintahkan React untuk merender seluruh komponen aplikasi di dalamnya.

---

## Bab 2: Titik Masuk Aplikasi (`src`)

File-file ini bertanggung jawab untuk memulai dan menstrukturkan aplikasi React.

### `src/index.tsx`
- **Apa itu?** Titik masuk (entry point) dari aplikasi React. Ini adalah file JavaScript/TypeScript pertama yang dieksekusi.
- **Cara Kerjanya:** Kode di sini menunjuk ke elemen `<div id="root">` di `index.html` dan merender komponen utama aplikasi, yaitu `<App />`, ke dalam root tersebut.

### `src/App.tsx`
- **Apa itu?** Komponen utama yang menjadi "kerangka" atau "layout" dari seluruh situs.
- **Cara Kerjanya:** Komponen ini mengatur struktur tingkat tinggi, termasuk:
  1.  **`<Router>`**: Membungkus semua komponen lain untuk mengaktifkan fungsionalitas routing (berpindah halaman).
  2.  **`<LoadingProvider>`**: Menyediakan konteks global untuk menampilkan layar pemuatan.
  3.  **`<Header />`**: Menampilkan header/navigasi yang akan selalu terlihat.
  4.  **`<Routes>`**: Bagian dinamis tempat React Router akan menukar komponen halaman (`HomePage`, `AboutPage`, dll.) berdasarkan URL yang sedang aktif.
  5.  **`<Footer />`**: Menampilkan footer yang juga akan selalu terlihat.

### `src/contexts/LoadingContext.tsx`
- **Apa itu?** Penyedia konteks (Context Provider) React untuk mengelola status layar pemuatan (loading screen) secara global.
- **Cara Kerjanya:** Memungkinkan komponen mana pun dalam aplikasi untuk menampilkan atau menyembunyikan layar pemuatan tanpa harus meneruskan *props* melalui banyak level. Komponen `AdminDashboard` menggunakannya saat melakukan operasi data (tambah, edit, hapus).

---

## Bab 3: Halaman (`src/pages`)

Folder ini berisi komponen-komponen yang mewakili satu halaman penuh.

### `HomePage.tsx`
- **Fungsi:** Halaman utama (landing page) yang menyambut pengguna.
- **Struktur:** Menggabungkan beberapa komponen bagian seperti `Hero`, `FeaturedCars`, `CollectionSection`, dan `TestimonialSection` untuk membentuk halaman yang kohesif.

### `AboutPage.tsx`
- **Fungsi:** Halaman statis "Tentang Kami".
- **Struktur:** Berisi teks yang menjelaskan visi, misi, dan nilai-nilai dari Garasix Showroom.

### `CarListPage.tsx` & `CarDetailPage.tsx`
- **Fungsi:** `CarListPage.tsx` menampilkan seluruh koleksi mobil. `CarDetailPage.tsx` menampilkan detail lengkap dari satu mobil yang dipilih.
- **Cara Kerja:** Kedua halaman ini mengambil data langsung dari backend API. `CarDetailPage` menggunakan ID mobil dari parameter URL untuk mengambil data mobil yang spesifik.

### `LoginPage.tsx`
- **Fungsi:** Menyediakan formulir bagi admin untuk masuk.
- **Cara Kerja:** Mengirimkan *username* dan *password* ke endpoint `/login` di backend. Jika berhasil, status login disimpan di `sessionStorage` dan pengguna diarahkan ke dasbor admin.

### `AdminDashboard.tsx`
- **Fungsi:** Halaman khusus admin untuk mengelola data mobil (CRUD: Create, Read, Update, Delete).
- **Cara Kerja:**
    - **Read:** Mengambil dan menampilkan semua data mobil dari backend saat halaman dimuat.
    - **Create:** Menyediakan formulir untuk menambahkan mobil baru.
    - **Update:** Memungkinkan admin mengedit data mobil yang ada.
    - **Delete:** Menyediakan tombol untuk menghapus mobil.
    - Semua operasi data berkomunikasi langsung dengan API backend.

### `ChatBot.tsx`
- **Fungsi:** Mengimplementasikan chatbot interaktif untuk rekomendasi mobil.
- **Cara Kerja:** Mengirim pesan pengguna ke layanan webhook eksternal (n8n) dan menampilkan respons dari bot AI untuk membantu pengguna.

### `NotFoundPage.tsx`
- **Fungsi:** Halaman yang ditampilkan ketika pengguna mengunjungi URL yang tidak ada.

---

## Bab 4: Komponen (`src/components`)

Folder ini berisi blok bangunan UI yang lebih kecil dan dapat digunakan kembali.

- **`Header.tsx` & `Footer.tsx`**: Komponen navigasi atas dan footer bawah yang konsisten di semua halaman. `Header` bersifat dinamis, tampilannya berubah tergantung status login pengguna.
- **`Hero.tsx`**: Banner besar di halaman utama.
- **`FeaturedCars.tsx` & `CollectionSection.tsx`**: Menampilkan galeri mobil. Mengambil data dari backend API.
- **`CarCard.tsx`**: Komponen kartu untuk menampilkan ringkasan satu mobil. Digunakan di banyak halaman.
- **`CarDetail.tsx`**: Menampilkan semua detail dari satu mobil, termasuk gambar dan spesifikasi.
- **`TestimonialSection.tsx`**: Menampilkan bagian testimoni pelanggan.
- **`ScrollToTop.tsx`**: Komponen fungsional yang sangat penting untuk pengalaman pengguna.
  - **Masalah yang Dipecahkan**: Pada aplikasi satu halaman (Single Page Application), `react-router` tidak secara otomatis mengembalikan posisi scroll ke atas saat berpindah halaman. Ini menyebabkan halaman baru ditampilkan dari posisi scroll halaman sebelumnya (misalnya, dari bagian bawah).
  - **Cara Kerja**: Komponen ini menggunakan *hook* `useLocation` untuk mendeteksi setiap perubahan pada URL. Ketika URL berubah, ia secara otomatis menjalankan `window.scrollTo(0, 0)`, memaksa halaman untuk selalu ditampilkan dari paling atas.

---

## Bab 5: Arsitektur Backend (FastAPI)

Backend proyek ini berfungsi sebagai REST API yang dibangun menggunakan FastAPI (Python) dengan **arsitektur berlapis (layered architecture)** untuk memastikan kode yang terorganisir, mudah dikelola, dan skalabel. Arsitektur ini memisahkan tanggung jawab menjadi beberapa lapisan yang jelas.

### Struktur Direktori Backend
- **`main.py`**: Titik masuk (entry point) aplikasi FastAPI. Tugasnya hanya menginisialisasi aplikasi, mengatur middleware (seperti CORS), dan menyertakan *router* dari modul lain.
- **`/database`**: Mengatur koneksi ke database PostgreSQL menggunakan SQLAlchemy/SQLModel.
- **`/models`**: Mendefinisikan bentuk data (skema) menggunakan SQLModel. Ini adalah blueprint untuk tabel di database dan juga untuk validasi data API.
- **`/repositories`**: **Lapisan Akses Data (Data Access Layer)**. Bertanggung jawab untuk berkomunikasi **langsung dengan database**. Semua query SQL (dieksekusi melalui SQLAlchemy) berada di sini.
- **`/controllers`**: **Lapisan Logika Bisnis (Business Logic Layer)**. Menjembatani `routes` dan `repositories`. Memproses data masuk, melakukan validasi, dan memanggil fungsi di `repository`.
- **`/routes`**: **Lapisan Routing**. Mendefinisikan endpoint API (URL) dan menghubungkannya ke fungsi di *controller*.

### Alur Kerja Permintaan (Request Flow)
1.  **Permintaan Masuk**: Frontend mengirim permintaan HTTP ke sebuah URL (misal: `GET /cars`).
2.  **Routing (`/routes`)**: `car_routes.py` menerima permintaan ini karena cocok dengan endpoint `/cars`, lalu memanggil fungsi yang sesuai dari `car_controller`.
3.  **Logika Bisnis (`/controllers`)**: `car_controller.py` mengeksekusi logika. Untuk `GET /cars`, ia hanya perlu memanggil `car_repository` untuk mendapatkan semua data mobil.
4.  **Akses Data (`/repositories`)**: `car_repository.py` **menjalankan query SQL** (misalnya, `select(Car).offset(skip).limit(limit)`) ke database PostgreSQL menggunakan SQLAlchemy dan mengembalikan hasilnya (objek model) ke *controller*.
5.  **Respons**: Data dikembalikan melalui lapisan-lapisan hingga sampai ke frontend sebagai respons JSON.

### Penjelasan per Lapisan

#### `models`
- **Tujuan**: Mendefinisikan struktur data yang valid dan bentuk tabel database.
- **Isi**: Kelas-kelas yang mewarisi dari `SQLModel`. Contoh: `Car`, `User`. Ini memastikan konsistensi data di seluruh aplikasi.

#### `repositories`
- **Tujuan**: Mengisolasi semua logika akses database. Ini adalah **satu-satunya lapisan yang "tahu" cara berbicara dengan database**. Jika Anda mengganti database dari PostgreSQL ke MySQL, lapisan inilah yang akan diubah.
- **Isi**: Fungsi-fungsi seperti `create_car`, `get_all_cars`, `get_car_by_id` yang berisi perintah SQLAlchemy (`session.add()`, `session.exec(select(...))`, `session.get()`). Ia menerima *session* database dari *controller* dan menggunakannya untuk melakukan operasi.

#### `controllers`
- **Tujuan**: Menjalankan logika bisnis dan mengoordinasikan alur kerja. Lapisan ini tidak tahu apa-apa tentang database, ia hanya tahu cara berbicara dengan *repository*.
- **Isi**: Fungsi seperti `create_new_car`, `get_all_cars`. Fungsi ini menerima data dari *router*, melakukan pemeriksaan (misalnya, "apakah mobil dengan ID ini ada sebelum dihapus?"), lalu memanggil fungsi yang sesuai di `car_repository`. Ia juga bertanggung jawab untuk menangani `HTTPException` (seperti error 404 Not Found).

#### `routes`
- **Tujuan**: Mendefinisikan API endpoint yang bisa diakses oleh dunia luar (frontend).
- **Isi**: Menggunakan `APIRouter` dari FastAPI untuk mendeklarasikan path seperti `@router.get("/cars")` dan menghubungkannya ke fungsi di *controller*. Lapisan ini bertanggung jawab untuk menangani dependensi seperti `SessionDep`.

---

## Bab 6: Koneksi Frontend & Backend

### Arsitektur Terpisah (Decoupled)
Proyek ini menggunakan arsitektur terpisah:
- **Frontend (React)**: Berjalan di `http://localhost:3000`, bertanggung jawab atas antarmuka pengguna.
- **Backend (FastAPI)**: Berjalan di `http://localhost:8000`, bertanggung jawab atas logika bisnis dan data.

### Mekanisme Komunikasi
Komunikasi terjadi melalui **permintaan HTTP** menggunakan `fetch` API di frontend.

- **Pentingnya CORS (Cross-Origin Resource Sharing)**: Karena frontend dan backend berjalan di port yang berbeda, backend perlu dikonfigurasi untuk mengizinkan permintaan dari frontend. Ini dilakukan di `main.py` menggunakan `CORSMiddleware`, yang secara eksplisit mengizinkan origin `http://localhost:3000`.

### Contoh Alur: Menampilkan Detail Mobil
1.  **Pengguna**: Mengklik mobil di halaman koleksi. URL berubah menjadi `/koleksi/1`.
2.  **Frontend**: Komponen `CarDetailPage.tsx` dirender dan mengambil `carId` (yaitu `1`) dari URL.
3.  **Frontend**: `useEffect` memicu panggilan `fetch('http://localhost:8000/cars/1')`.
4.  **Backend**: Menerima permintaan `GET` di endpoint `/cars/{car_id}`.
5.  **Backend**: Alur `routes` -> `controllers` -> `repositories` dieksekusi untuk menemukan mobil dengan `id: 1` di **database**.
6.  **Backend**: Mengirimkan kembali data mobil yang ditemukan sebagai respons JSON.
7.  **Frontend**: Menerima respons, menyimpannya dalam *state*, dan menampilkan detail mobil di layar.

---

## Bab 7: Panduan Pengembangan

### Menjalankan Proyek
1.  **Backend**:
    - Buka terminal di `backend/FastApi`.
    - Aktifkan virtual environment: `venv\Scripts\activate`.
    - Instal dependensi: `pip install -r requirements.txt`.
    - Jalankan server: `uvicorn main:app --reload`.
2.  **Frontend**:
    - Buka terminal di root proyek (`uas_showroom`).
    - Instal dependensi: `npm install`.
    - Jalankan aplikasi: `npm start`.

### Menambah Halaman Baru (Contoh: Halaman "Kontak")
1.  **Buat File Halaman**: Buat `src/pages/ContactPage.tsx`.
2.  **Isi Komponen**: Buat komponen React dasar di dalamnya.
3.  **Daftarkan Rute**: Di `src/App.tsx`, impor komponen baru dan tambahkan `<Route path="/kontak" element={<ContactPage />} />` di dalam `<Routes>`.
4.  **Tambah Link (Opsional)**: Di `src/components/Header.tsx`, tambahkan `<Link to="/kontak">Kontak</Link>` agar muncul di navigasi.

---

## Bab 8: Pembaruan Fitur - Autentikasi dan Role Pengguna

Bagian ini menjelaskan fitur-fitur keamanan dan manajemen pengguna baru yang telah ditambahkan ke dalam proyek.

### 1. Sistem Autentikasi Berbasis JWT (JSON Web Token)

Aplikasi kini dilengkapi sistem autentikasi aman menggunakan JSON Web Token (JWT) untuk melindungi data dan halaman admin.

-   **Alur Login**:
    1.  Pengguna memasukkan kredensial di halaman Login.
    2.  Frontend mengirim data ke endpoint backend `POST /users/login`.
    3.  Backend memverifikasi kredensial dengan hash password di database.
    4.  Jika berhasil, backend membuat sebuah **token JWT** yang berisi informasi pengguna (seperti `username` dan `role`) dan mengirimkannya kembali ke frontend.
    5.  Frontend menerima token ini dan menyimpannya di `sessionStorage` browser untuk digunakan pada sesi tersebut.

### 2. Manajemen Role Pengguna (RBAC - Role-Based Access Control)

Struktur database telah diperbarui untuk mendukung sistem peran pengguna, memungkinkan adanya level akses yang berbeda.

-   **Struktur Database**:
    -   Tabel **`roles`**: Sebuah tabel baru yang berisi daftar semua peran yang mungkin (misalnya, `id: 1, name: 'admin_utama'`).
    -   Tabel **`users`**: Tabel pengguna sekarang memiliki kolom `role_id` yang berfungsi sebagai *foreign key* yang merujuk ke tabel `roles`.
-   **Tiga Peran Utama**:
    1.  **AdminUtama**: Memiliki akses tertinggi.
    2.  **Admin**: Memiliki akses administratif standar.
    3.  **Sales**: Memiliki akses terbatas, hanya untuk fitur-fitur penjualan.
-   **Script Pembuatan Pengguna (`create_user.py`)**: Sebuah script utilitas telah dibuat untuk membantu developer menambahkan pengguna baru ke database dengan password yang sudah di-hash dan `role_id` yang sesuai.

### 3. Logika Frontend Berbasis Peran (Role-Aware)

Frontend kini "sadar" akan peran pengguna yang sedang login dan dapat menyesuaikan tampilannya.

-   **Pengalihan Dinamis**: Setelah login berhasil, `LoginPage.tsx` mendekode token JWT untuk membaca `role` pengguna. Berdasarkan `role` ini, pengguna akan diarahkan ke dasbor yang sesuai (misalnya, `/admin/dashboard` untuk admin atau `/sales/dashboard` untuk sales).
-   **Komponen Terproteksi (`ProtectedComponent.tsx`)**: Sebuah komponen baru telah dibuat yang dapat "membungkus" bagian dari UI. Komponen ini hanya akan menampilkan isinya jika `role` pengguna yang sedang login cocok dengan `requiredRole` yang ditentukan.

### 4. Konteks Global untuk Autentikasi (`AuthContext.tsx`)

Manajemen status login kini terpusat dan lebih modern menggunakan React Context.

-   **Fungsi**: `AuthContext` menjadi "sumber kebenaran tunggal" untuk status login di seluruh aplikasi.
-   **Isi**: Menyediakan informasi `user` (username dan role), `token`, serta fungsi `login()` dan `logout()` yang bisa diakses oleh komponen mana pun (seperti `Header` dan `LoginPage`) tanpa perlu meneruskan *props*.
-   **Persistensi**: `AuthContext` secara otomatis memeriksa `sessionStorage` saat aplikasi dimuat. Ini berarti jika pengguna me-refresh halaman, mereka akan tetap dalam keadaan login.
