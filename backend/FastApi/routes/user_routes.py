from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from database.config import SessionDep
from models.user_model import UserCreate, UserRead
import repositories.user_repository as user_repo

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_new_user(user_create: UserCreate, session: SessionDep):
    """Register a new user."""
    # Check if user already exists
    db_user = user_repo.get_user_by_username(session, username=user_create.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    return user_repo.register_user(session=session, user_create=user_create)

@router.post("/login")
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    """Authenticate user and return a dummy token."""
    user = user_repo.authenticate_user(
        session=session, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # In a real application, you would create and return a JWT token here.
    # For now, we return a dummy response.
    return {"message": "Login successful!", "username": user.username, "user_id": user.id}