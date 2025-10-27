from sqlalchemy.orm import Session
from sqlalchemy import select
from models.user_model import User
from schemas_definition import UserCreate

def get_user_by_username(session: Session, username: str) -> User | None:
    """
    Retrieves a single user by their username.
    """
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    return user

# You can add other user-related database operations here, e.g., create_user, update_user, delete_user
