from pydantic import BaseModel
from sqlmodel import Field, SQLModel

class UserModel(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(default=None, primary_key=True)
    username: str
    password: str

class User(BaseModel):
    username: str
    password: str
