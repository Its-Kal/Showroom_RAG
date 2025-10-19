import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

import models.user_model as models
import repositories.user_repository as user_repository
import schemas
from database import get_db
from models.user_model import UserRole

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

def get_current_active_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    if user.role.value != token_data.role:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token/Role mismatch. Please re-login.")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

def get_current_active_admin_utama(current_user: models.User = Depends(get_current_active_user)):
    if current_user.role != models.UserRole.ADMIN_UTAMA:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user

def get_current_active_admin(current_user: models.User = Depends(get_current_active_user)):
    if current_user.role not in [models.UserRole.ADMIN_UTAMA, models.UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user

def role_checker(allowed_roles: list[UserRole]):
    """
    Dependency factory to check user roles.
    """
    def get_current_user_with_roles(
        current_user: models.User = Depends(get_current_active_user)
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You do not have access to this resource."
            )
        return current_user
    return get_current_user_with_roles
