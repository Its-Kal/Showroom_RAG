from fastapi import APIRouter, Depends
from models.user_model import Token
from controllers import auth_controller
from database.config import get_session
from sqlmodel import Session
from typing import Annotated

router = APIRouter(
    prefix="/users", # Prefix all routes in this file with /users
    tags=["Authentication"]
)

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: Depends(auth_controller.login_for_access_token) # Delegate to controller
):
    return form_data
