from fastapi import HTTPException, status
from models.user_model import User
import repositories.user_repository as user_repo
from database.config import SessionDep

def authenticate_user(user: User) -> dict:
    db_user = user_repo.find_user_by_username(user.username)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": f"Welcome {db_user['full_name']}! Login successful."}

def get_all_users(session: SessionDep):
    return user_repo.get_all_users_from_db(session)
