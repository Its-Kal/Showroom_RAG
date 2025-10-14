# Skrip Video/Presentasi: Belajar ORM di Proyek Showroom Kita

**(Setting: Split screen, satu sisi wajah presenter, sisi lain menampilkan kode dari VS Code atau editor lainnya)**

---

### Bagian 1: Pembukaan & Konsep Dasar ORM

**(Wajah presenter full screen atau dominan)**

"Halo semuanya! Selamat datang kembali. Hari ini kita akan membahas salah satu bagian paling keren dari backend kita: **ORM**."

"Mungkin kalian pernah dengar istilah ini, atau mungkin juga belum. Tenang saja, di sini kita akan jelaskan sesederhana mungkin, seolah-olah saya lagi ngajarin teman."

"Jadi, apa sih ORM itu?"

"Bayangkan ORM atau *Object-Relational Mapping* itu seperti **penerjemah super pintar**. Di satu sisi, kita punya kode Python kita yang berisi objek, kelas, dan logika. Di sisi lain, kita punya database (seperti PostgreSQL) yang bahasanya adalah SQL."

**(Ganti ke split screen, tunjukkan contoh kode SQL sederhana di editor)**

"Biasanya, kalau mau ambil data dari database, kita harus tulis perintah SQL seperti ini: `SELECT * FROM cars WHERE category = 'SUV';`. Ini ditulis dalam bentuk *string*, yang mana gampang salah ketik dan kurang intuitif bagi programmer Python."

"Nah, di sinilah ORM beraksi! Dengan ORM, kita nggak perlu lagi nulis SQL manual. Kita cukup tulis kode Python biasa, dan ORM yang akan menerjemahkannya ke SQL untuk kita."

"Kenapa kita pakai ORM? Keuntungannya banyak banget:

1.  **Kerja Lebih Cepat**: Kita tetap di dunia Python, nggak perlu ganti-ganti 'bahasa' ke SQL. Jadi lebih fokus dan produktif.
2.  **Lebih Aman**: ORM secara otomatis membantu kita terhindar dari serangan umum seperti *SQL Injection*.
3.  **Kode Gampang Dibaca**: Kode kita jadi lebih bersih dan deklaratif. Orang lain (atau kita sendiri di masa depan) bakal lebih mudah paham.
4.  **Fleksibel**: Kalau suatu saat kita mau ganti database dari PostgreSQL ke MySQL misalnya, kode Python kita nggak perlu diubah sama sekali! Keren, kan?"

---

### Bagian 2: Demo Langsung di Proyek Showroom

**(Fokus utama di layar kode, wajah presenter di pojok)**

"Oke, cukup teorinya. Mari kita lihat langsung implementasinya di proyek showroom kita. Kita pakai library ORM bernama **SQLModel**."

**1. Mendefinisikan Model**

**(Buka file `backend/FastApi/models/car_model.py`)**

"Langkah pertama adalah mendefinisikan 'cetakan' atau *blueprint* dari data kita. Lihat file `car_model.py` ini."

"Class `Car` ini merepresentasikan tabel `cars` di database kita. Setiap properti di sini, seperti `id`, `name`, `year`, `price`, itu akan menjadi kolom di dalam tabel."

"Perhatikan baris `class Car(SQLModel, table=True):`. Inilah 'sihir'-nya. Baris ini memberitahu SQLModel bahwa class `Car` ini adalah sebuah model tabel database. Simpel banget!"

**2. Query & Mengambil Data**

**(Buka file `backend/FastApi/repositories/car_repository.py`)**

"Sekarang, bagaimana cara kita mengambil data mobil dari database? Kita lihat di `car_repository.py`."

"Lihat fungsi `get_all_cars`. Di sini kita nggak ada tulis `SELECT * FROM cars`. Kita cukup pakai `session.exec(select(Car)).all()`. Artinya: 'Hei session, tolong pilih semua data dari model `Car`, dan berikan semuanya'. Sangat Pythonic!"

"Contoh lain, di fungsi `find_car_by_id`. Kita cuma perlu panggil `session.get(Car, car_id)`. Jauh lebih bersih daripada nulis `SELECT * FROM cars WHERE id = ...`."

**3. Menambah & Mengubah Data**

"Gimana kalau mau nambah mobil baru? Lihat fungsi `add_car`."

"Logikanya sederhana: kita buat sebuah objek `Car` baru, lalu kita bilang ke session: `session.add(db_car)` untuk menyiapkan data, dan `session.commit()` untuk menyimpannya secara permanen ke database. ORM yang akan mengurus perintah `INSERT INTO` yang rumit di belakang layar."

---

### Bagian 3: Relationship Antar Tabel (Konsep Tambahan)

**(Fokus di layar kode, bisa sambil mengetik contoh baru)**

"Satu lagi kekuatan terbesar ORM adalah mengelola hubungan antar tabel."

"Di proyek kita saat ini, tabel `users` dan `cars` masih berdiri sendiri. Tapi bayangkan kalau kita mau mencatat mobil mana dimiliki oleh user siapa. Kita perlu membuat relasi."

"Dengan ORM, ini jadi gampang. Kita bisa definisikan seperti ini:"

**(Tunjukkan contoh kode hipotetis ini)**

```python
# Di file user_model.py
class User(SQLModel, table=True):
    # ... (properti user lainnya)
    # Satu user bisa punya banyak mobil
    cars: List["Car"] = Relationship(back_populates="owner")

# Di file car_model.py
class Car(SQLModel, table=True):
    # ... (properti mobil lainnya)
    # Setiap mobil dimiliki oleh satu user
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional["User"] = Relationship(back_populates="cars")
```

"Dengan kode `Relationship` ini, kita sudah membuat 'jembatan' antara tabel user dan mobil. Nanti kalau kita mau lihat semua mobil milik seorang user, kita tinggal panggil `user.cars`. ORM yang akan mengurus *join* tabel yang kompleks di belakang layar."

---

### Bagian 4: Penutup

**(Wajah presenter kembali dominan)**

"Jadi, itulah dia pengenalan singkat tentang ORM dan bagaimana kita menggunakannya di proyek ini."

"Intinya, ORM membuat hidup kita sebagai developer jadi lebih mudah, kode lebih bersih, dan lebih aman. Kita bisa fokus pada logika aplikasi kita, dan biarkan ORM yang jadi penerjemah andal ke database."

"Semoga penjelasan ini bermanfaat ya. Kalau ada pertanyaan, jangan ragu untuk diskusi. Terima kasih sudah menonton!"
