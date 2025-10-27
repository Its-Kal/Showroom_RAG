from sqlalchemy import Boolean, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, Optional

from db import Base

if TYPE_CHECKING:
    from .rbac_model import Role


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column("password", String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Foreign Key to Role
    role_id: Mapped[int | None] = mapped_column(ForeignKey("role.id"), nullable=True)

    # Relationship to Role
    role: Mapped[Optional["Role"]] = relationship(back_populates="users")
