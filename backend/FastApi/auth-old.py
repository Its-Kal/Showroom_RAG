import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Callable

from models.user_model import User
import repositories.user_repository as user_repository
import schemas_definition as schemas
from db import get_db

# It's recommended to load this from environment variables
SECRET_KEY = "your-super-secret-key-that-is-long-and-random"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_active_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email, role=role)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = user_repository.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception

    # Verify role from token against the role in the database
    if not user.role or user.role.name != token_data.role:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token/Role mismatch. Please re-login.")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

def require_permission(required_permission: str) -> Callable:
    """
    Dependency factory to check if a user has a specific permission.
    """
    def _check_permission(current_user: User = Depends(get_current_active_user)) -> User:
        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akses ditolak: User tidak memiliki role."
            )
        
        user_permissions = {perm.name for perm in current_user.role.permissions}
        
        if required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akses ditolak: Anda tidak memiliki izin yang diperlukan."
            )
        return current_user
    return _check_permission
