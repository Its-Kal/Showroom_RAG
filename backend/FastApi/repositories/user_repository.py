from sqlalchemy.orm import Session
from sqlalchemy import select
from models.user_model import User
from schemas_definition import UserCreate

def get_user_by_username(session: Session, username: str) -> User | None:
    """
    Retrieves a single user by their username.
    """
    print(f"--- REPOSITORY: Mencari pengguna dengan username: '{username}' ---")
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    print(f"--- REPOSITORY: Hasil query database: {user} ---")
    return user

def get_user_by_email(session: Session, email: str) -> User | None:
    """
    Retrieves a single user by their email.
    """
    statement = select(User).where(User.email == email)
    return session.execute(statement).scalar_one_or_none()

def create_user(session: Session, user_create: UserCreate, hashed_password: str) -> User:
    """
    Adds a new user to the database.
    """
    new_user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password,
        role_id=user_create.role_id,
        is_active=True
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user
