from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from db import Base

if TYPE_CHECKING:
    from .user_model import User


# Junction table for Role and Permission many-to-many relationship
role_permissions_table = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("role.id"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permission.id"), primary_key=True),
)


class Role(Base):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationship to User (One-to-Many)
    users: Mapped[list["User"]] = relationship(back_populates="role")

    # Relationship to Permission (Many-to-Many)
    permissions: Mapped[list["Permission"]] = relationship(
        secondary=role_permissions_table, back_populates="roles", lazy="joined"
    )


class Permission(Base):
    __tablename__ = "permission"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationship to Role (Many-to-Many)
    roles: Mapped[list["Role"]] = relationship(
        secondary=role_permissions_table, back_populates="permissions"
    )
