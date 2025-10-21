from sqlmodel import Session, select
from models.user_model import User

def get_user_by_username(session: Session, username: str) -> User | None:
    """
    Retrieves a single user by their username.
    
    Args:
        session: The database session.
        username: The username to search for.
        
    Returns:
        The User object if found, otherwise None.
    """
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    return user
