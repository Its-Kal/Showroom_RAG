from fastapi import HTTPException, status
from models.user_model import User
import repositories.user_repository as user_repo

def authenticate_user(user: User) -> dict:
    result = user_repo.login_user(user)
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.get("error", "Incorrect username or password"),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Data pengguna sekarang langsung dari tabel kustom kita
    user_data = result["data"]
    # Gunakan username untuk pesan sambutan
    username = user_data.get("username", "User")

    return {"message": f"Welcome {username}! Login successful."}
