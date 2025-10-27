from sqlmodel import Session, select
from models.user_model import User

def get_user_by_username(session: Session, username: str) -> User | None:
    """
    Retrieves a single user by their username.
    """
    print(f"--- REPOSITORY: Mencari pengguna dengan username: '{username}' ---")
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    print(f"--- REPOSITORY: Hasil query database: {user} ---")
    return user
