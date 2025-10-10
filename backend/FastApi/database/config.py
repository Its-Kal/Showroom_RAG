# di dalam file database/config.py
import os
from typing import Annotated  # <-- PENTING
from dotenv import load_dotenv
from supabase import create_client, Client

# Sesuaikan import ini dengan library yang kamu pakai (SQLModel atau SQLAlchemy)
from sqlmodel import create_engine, Session, SQLModel
from fastapi import Depends  # <-- PENTING

load_dotenv()

# --- Bagian Klien Supabase (sudah benar) ---
supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_supabase_client():
    return supabase

# --- Bagian Koneksi Database (YANG PERLU DITAMBAHKAN) ---
# Pastikan kamu punya DATABASE_URL di file .env-mu juga
# Formatnya: "postgresql://user:password@host:port/dbname"
DATABASE_URL = os.environ.get("DATABASE_URL")

# 1. Buat Engine
# Opsi connect_args ini penting untuk SQLite, tapi bisa di-disable untuk PostgreSQL
engine = create_engine(DATABASE_URL, echo=True)

# 2. Buat fungsi untuk menyediakan sesi
def get_session():
    with Session(engine) as session:
        yield session

# 3. BUAT DEFINISI 'SessionDep' YANG HILANG
SessionDep = Annotated[Session, Depends(get_session)]

# 4. Fungsi untuk membuat tabel (sudah kamu buat)
def create_db_and_tables():
    # Gunakan SQLModel untuk membuat semua tabel
    SQLModel.metadata.create_all(engine)
    print("Database dan tabel berhasil dibuat.")