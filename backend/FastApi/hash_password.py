
import bcrypt
import sys

# Pastikan pengguna memberikan password sebagai argumen
if len(sys.argv) < 2:
    print("Gunakan: python hash_password.py [password_anda]")
    sys.exit(1)

# Ambil password dari argumen command line
password_to_hash = sys.argv[1].encode('utf-8')

# Generate hash
hashed_password = bcrypt.hashpw(password_to_hash, bcrypt.gensalt())

# Print hash-nya. Gunakan nilai ini di database Anda.
print("Password Hashed:")
print(hashed_password.decode('utf-8'))
