from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from repositories import user_repository
from schemas_definition import UserRead, UserCreate
from models.user_model import User, UserLogin, Token
from auth import create_access_token # Pastikan tidak ada folder 'auth' yang konflik
from controllers.utils import verify_password # Impor dari lokasi yang benar

def login_for_access_token(session: Session, user_in: UserLogin) -> Token:
    """
    Controller logic to handle user login and return a JWT access token.
    """
    print(f"--- CONTROLLER: Menerima permintaan login untuk username: '{user_in.username}' ---")
    print(f"--- CONTROLLER: Password yang diterima: '{user_in.password}' ---")

    db_user = user_repository.get_user_by_username(session=session, username=user_in.username)

    if not db_user:
        print("--- CONTROLLER: Verifikasi GAGAL. Pengguna tidak ditemukan di database. ---")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check password, sesuaikan dengan nama kolom di model Anda
    is_password_correct = verify_password(user_in.password, db_user.hashed_password)
    print(f"--- CONTROLLER: Hasil verifikasi password: {is_password_correct} ---")

    if not is_password_correct:
        print("--- CONTROLLER: Verifikasi GAGAL. Password tidak cocok. ---")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # If everything is correct, create and return the token
    print("--- CONTROLLER: Verifikasi BERHASIL. Membuat token... ---")
    # Ambil role dari relasi di database
    role_name = None
    if hasattr(db_user, 'role') and db_user.role:
        role_name = db_user.role.name

    access_token = create_access_token(
        data={"sub": db_user.username, "role": role_name} # Gunakan username atau email sebagai sub
    )

    return Token(access_token=access_token, token_type="bearer")

def register_new_user(user_create: UserCreate, session: Session) -> UserRead:
    """
    Controller logic to handle new user registration.
    """
    # Logika ini sebaiknya ada di controller, bukan langsung di route
    from controllers.utils import hash_password

    existing_user = user_repository.get_user_by_email(session, email=user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    # Cek juga username
    existing_username = user_repository.get_user_by_username(session, username=user_create.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username sudah terdaftar")

    hashed_password = hash_password(user_create.password)
    
    return user_repository.create_user(session, user_create=user_create, hashed_password=hashed_password)

def authenticate_and_get_user(session: Session, username: str, password: str) -> User:
    user = user_repository.get_user_by_username(session, username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
