# Dokumentasi Teknis Backend UAS Showroom

Dokumen ini menjelaskan arsitektur, alur kerja, dan panduan teknis untuk proyek backend Showroom Mobil yang dibangun menggunakan FastAPI.

## 1. Arsitektur & Pola Desain

Backend ini dirancang menggunakan **Prinsip Tanggung Jawab Tunggal (Single Responsibility Principle - SRP)** yang memisahkan logika aplikasi ke dalam tiga layer utama. Tujuannya adalah untuk menciptakan codebase yang terorganisir, mudah dipelihara, dan aman.

### Peran Tiga Layer Utama

Analogi yang digunakan adalah Restoran:

1.  **`routes/` (Pelayan)**
    *   **Tanggung Jawab:** Menerima pesanan (request) dari pelanggan (frontend/user) dan mengantarkan pesanan yang sudah jadi (response).
    *   **Aturan:**
        *   Hanya berisi definisi endpoint (`@router.get`, `@router.post`, dll.).
        *   Tidak tahu cara membuat "makanan" (business logic).
        *   Langsung meneruskan setiap pesanan ke `controllers` (Koki).
        *   Contoh: `routes/car_routes.py`

2.  **`controllers/` (Koki)**
    *   **Tanggung Jawab:** Sebagai "otak" dari aplikasi. Memproses pesanan, melakukan validasi, dan menerapkan semua business logic.
    *   **Aturan:**
        *   Menerima data dari `routes`.
        *   **Melakukan validasi dan sanitasi input secara ketat.** Ini adalah pos keamanan utama untuk memastikan data dari luar bersih dan aman.
        *   Memanggil `repositories` (Asisten Gudang) untuk mengambil atau menyimpan bahan (data).
        *   Tidak pernah berinteraksi langsung dengan database.
        *   Contoh: `controllers/car_controller.py`

3.  **`repositories/` (Asisten Gudang)**
    *   **Tanggung Jawab:** Satu-satunya layer yang boleh berinteraksi langsung dengan "gudang" (database).
    *   **Aturan:**
        *   Hanya berisi fungsi-fungsi untuk operasi database (CRUD - Create, Read, Update, Delete).
        *   Menerima data yang **sudah bersih dan tervalidasi** dari `controllers`.
        *   Tidak mengandung business logic apapun.
        *   Contoh: `repositories/car_repository.py`

## 2. Alur Kerja Request (Request Flow)

Berikut adalah alur sebuah HTTP request dari user hingga kembali menjadi response:

```
User/Frontend --> ROUTE --> CONTROLLER --> REPOSITORY --> Database
   (Response) <-- ROUTE <-- CONTROLLER <-- REPOSITORY <--
```

**Langkah-langkah:**

1.  **User** mengirim request (misal: POST /users/register dengan data JSON).
2.  **Route (`user_routes.py`)** menerima request ini. Skema Pydantic (`UserCreate`) melakukan validasi Level 1 (bentuk data).
3.  **Route** segera memanggil fungsi di **Controller (`user_controller.register_new_user`)**, memberikan data dari user.
4.  **Controller** melakukan validasi Level 2 (Keamanan & Bisnis):
    *   Sanitasi data (misal: `email.lower().strip()`).
    *   Validasi format (misal: apakah email valid?).
    *   Validasi keamanan (misal: apakah password cukup kuat?).
    *   Validasi bisnis (misal: apakah email sudah terdaftar? Ini dilakukan dengan bertanya ke Repository).
5.  Jika semua validasi lolos, **Controller** memanggil fungsi di **Repository (`user_repository.add_user_to_db`)**, memberikan data yang sudah bersih.
6.  **Repository** menjalankan query untuk menyimpan data ke **Database**.
7.  Hasil dari database dikembalikan ke **Repository**, lalu ke **Controller**, lalu ke **Route**, dan akhirnya sebagai response ke **User**.

## 3. Struktur Folder Proyek

-   `/database/`: Mengelola konfigurasi dan koneksi database (`config.py`).
-   `/models/`: Berisi skema Pydantic dan model database SQLModel (`car_model.py`, `user_model.py`). Mendefinisikan "bentuk" data.
-   `/routes/`: Mendefinisikan semua endpoint API yang tersedia. Bertindak sebagai pintu masuk aplikasi.
-   `/controllers/`: Inti dari aplikasi, tempat semua business logic berada.
-   `/repositories/`: Lapisan akses data yang berkomunikasi langsung dengan database.
-   `/uploads/`: Direktori tempat file yang di-upload (seperti gambar mobil) disimpan.
-   `main.py`: File utama yang sangat minimalis, hanya untuk inisialisasi aplikasi FastAPI dan menyertakan semua router dari folder `routes`.

## 4. Panduan Validasi Keamanan

**Prinsip Utama: Jangan Pernah Percaya Input dari Frontend/User.**

Semua validasi data yang masuk dari luar **wajib** dilakukan di dalam **layer Controller**. Layer ini adalah benteng pertahanan untuk mencegah data "mentah" atau berbahaya masuk lebih dalam ke sistem atau database. Repository harus selalu menerima data yang sudah dianggap aman oleh Controller.

## 5. Daftar Endpoint Utama (Contoh)

| Method | Endpoint              | Controller Function                | Deskripsi                               |
|--------|-----------------------|------------------------------------|-----------------------------------------|
| GET    | `/cars/`              | `get_all_cars`                     | Mengambil semua data mobil.             |
| GET    | `/cars/{car_id}`      | `get_car_by_id`                    | Mengambil detail satu mobil.            |
| POST   | `/cars/`              | `create_new_car`                   | Membuat data mobil baru (dengan upload).|
| PUT    | `/cars/{car_id}`      | `update_existing_car`              | Memperbarui data mobil.                 |
| DELETE | `/cars/{car_id}`      | `delete_car_by_id`                 | Menghapus data mobil.                   |
| POST   | `/users/register`     | `register_new_user`                | Registrasi user baru.                   |
| POST   | `/users/login`        | `authenticate_and_get_user`        | Autentikasi user untuk login.           |

