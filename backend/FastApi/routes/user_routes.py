from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import Session

from database import get_db
from schemas import UserCreate, UserRead
import controllers.user_controller as user_controller
from auth import role_checker
from models.user_model import UserRole
import auth

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/register", 
            response_model=UserRead, 
            status_code=status.HTTP_201_CREATED,
            dependencies=[Depends(role_checker([UserRole.ADMIN_UTAMA]))])
def register_new_user(user_create: UserCreate, db: Session = Depends(get_db)):
    """Endpoint to register a new user. Only accessible by ADMIN_UTAMA."""
    return user_controller.register_new_user(user_create=user_create, session=db)

@router.post("/login")
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    """Endpoint to authenticate user and return an access token."""
    user = user_controller.authenticate_and_get_user(
        session=db, username=form_data.username, password=form_data.password
    )
    
    access_token_data = {
        "sub": user.email,
        "role": user.role.value
    }
    access_token = auth.create_access_token(data=access_token_data)
    
    return {"access_token": access_token, "token_type": "bearer"}
