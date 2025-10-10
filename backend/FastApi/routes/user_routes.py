from fastapi import APIRouter, status, Depends
from models.user_model import User, UserModel
import controllers.user_controller as user_controller
from database.config import SessionDep

router = APIRouter()

@router.post("/login")
def login(user: User):
    return user_controller.authenticate_user(user)

@router.get("/dimas", response_model=list[UserModel])
def read_root(session: SessionDep):
    return user_controller.get_all_users(session)
