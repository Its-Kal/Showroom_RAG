from fastapi import APIRouter
from models.user_model import User
import controllers.user_controller as user_controller

router = APIRouter()

@router.post("/login")
def login(user: User):
    return user_controller.authenticate_user(user)
