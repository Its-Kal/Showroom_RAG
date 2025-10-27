from fastapi import HTTPException, status
from sqlmodel import Session
from repositories import user_repository
from models.user_model import UserLogin, Token
from auth.security import verify_password, create_access_token

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

    # Check password
    is_password_correct = verify_password(user_in.password, db_user.password) # Assuming column is named 'password'
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
    access_token = create_access_token(
        data={"sub": db_user.username}
    )

    return Token(access_token=access_token, token_type="bearer")
