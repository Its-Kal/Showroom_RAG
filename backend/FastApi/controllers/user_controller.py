from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import re

from models.user_model import User
from schemas import UserCreate
import repositories.user_repository as user_repo
from controllers.utils import hash_password, verify_password

# Simple regex for email validation
EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

def register_new_user(user_create: UserCreate, session: Session) -> User:
    """Business logic to register a new user with validation."""
    email = user_create.email.lower().strip()
    username = user_create.username.strip()

    if not re.match(EMAIL_REGEX, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format.",
        )

    if len(user_create.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    # Check if email or username already exists
    if user_repo.get_user_by_email(session, email=email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    if user_repo.get_user_by_username(session, username=username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    hashed_pwd = hash_password(user_create.password)

    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_pwd,
        role=user_create.role
    )

    return user_repo.add_user_to_db(session=session, db_user=db_user)

def authenticate_and_get_user(session: Session, username: str, password: str) -> User:
    """Business logic to authenticate a user using email."""
    # The 'username' parameter from the form is treated as the email
    clean_email = username.lower().strip()
    db_user = user_repo.get_user_by_email(session, email=clean_email)

    if not db_user or not verify_password(plain_password=password, hashed_password=db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )

    return db_user