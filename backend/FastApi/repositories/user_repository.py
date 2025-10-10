import bcrypt
from models.user_model import User
from database.config import get_supabase_client

def login_user(user: User):
    supabase = get_supabase_client()
    try:
        # 1. Ambil data pengguna dari tabel 'users' berdasarkan username
        response = supabase.table('users').select("*").eq('username', user.username).execute()

        # 2. Cek apakah pengguna ditemukan
        if not response.data:
            return {"success": False, "error": "Invalid username or password"}

        user_data = response.data[0]
        stored_hashed_password = user_data.get("password").encode('utf-8')
        provided_password = user.password.encode('utf-8')

        # 3. Verifikasi password menggunakan bcrypt
        if bcrypt.checkpw(provided_password, stored_hashed_password):
            # Jangan kirim hash password ke frontend
            del user_data['password']
            return {"success": True, "data": user_data}
        else:
            return {"success": False, "error": "Invalid username or password"}

    except Exception as e:
        # Tangani error koneksi atau lainnya
        return {"success": False, "error": str(e)}
