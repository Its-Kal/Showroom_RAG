import sys
import os

# Tambahkan direktori saat ini ke sys.path untuk memastikan linter (Pylance)
# dan interpreter Python dapat menemukan modul 'utils'.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Impor fungsi 'get_password_hash' dari file 'hash_password.py' di dalam folder 'utils'
from utils.hash_password import get_password_hash

# --- Data Pengguna Awal ---
# Tentukan password mentah yang ingin Anda gunakan untuk login pertama kali
SEED_PASSWORDS = {
    'admin_utama': 'AdminMaster123!', 
    'admin': 'InventoryAdmin456',    
    'sales': 'SalesAgent789',      
}

def generate_hashes():
    """Menghasilkan hash bcrypt untuk pengguna awal dan mencetaknya."""
    print("==========================================")
    print("     GENERATOR PASSWORD HASH UNTUK SEED     ")
    print("==========================================")
    
    hashes_to_insert = {}
    
    for role, password in SEED_PASSWORDS.items():
        # Panggil fungsi yang benar: get_password_hash()
        hashed_pwd = get_password_hash(password)
        hashes_to_insert[role] = hashed_pwd
        
        print(f"\nRole: {role.upper()}")
        print(f"Password Mentah: {password}")
        print(f"PASSWORD HASH (SALIN INI): {hashed_pwd}") # <--- String hash yang dibutuhkan
        print("------------------------------------------")

    print("\nPROSES SELESAI. Salin hash di atas ke skrip SQL INSERT.")
    return hashes_to_insert

if __name__ == "__main__":
    generate_hashes()