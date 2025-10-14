from typing import Optional
from sqlmodel import Field, SQLModel

# Database Model (SQLModel)
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str

# API Model for creating a user
class UserCreate(SQLModel):
    username: str
    password: str

# API Model for reading user data (without password)
class UserRead(SQLModel):
    id: int
    username: str