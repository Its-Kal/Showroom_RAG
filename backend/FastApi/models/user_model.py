import enum
from sqlalchemy import Boolean, Column, Integer, String, Enum
from database import Base

class UserRole(str, enum.Enum):
    ADMIN_UTAMA = "admin_utama"
    SALES = "sales"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column("password", String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole, values_callable=lambda obj: [e.value for e in obj]), nullable=False, default=UserRole.SALES)
    is_active = Column(Boolean, default=True, nullable=False)
