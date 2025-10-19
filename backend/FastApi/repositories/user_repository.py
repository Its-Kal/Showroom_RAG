from sqlalchemy.orm import Session
from sqlalchemy import select
from models.user_model import User

def get_user_by_email(session: Session, email: str) -> User | None:
    """Fetches a user by their email."""
    statement = select(User).where(User.email == email)
    return session.execute(statement).scalars().first()

def get_user_by_username(session: Session, username: str) -> User | None:
    """Fetches a user by their username."""
    statement = select(User).where(User.username == username)
    return session.execute(statement).scalars().first()

def add_user_to_db(session: Session, db_user: User) -> User:
    """Creates a new user in the database."""
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
