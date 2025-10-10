from models.user_model import User, UserModel
from sqlmodel import Session, select

dummy_users_db = {
    "user1": {
        "username": "user1",
        "password": "password123",
        "full_name": "John Doe",
    }
}

def find_user_by_username(username: str):
    return dummy_users_db.get(username)

def get_all_users_from_db(session: Session):
    return session.exec(select(UserModel)).all()
