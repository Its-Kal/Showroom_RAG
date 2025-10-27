from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from typing import Annotated

from models.user_model import Token
from auth.security import verify_password, create_access_token
from repositories import user_repository
from database.config import get_session

def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    session: Annotated[Session, Depends(get_session)]
) -> Token:
    """
    Handles the business logic for user login.
    1. Finds the user in the database.
    2. Verifies the password.
    3. Gathers permissions.
    4. Creates and returns a JWT.
    """
    # 1. Find user
    user = user_repository.get_user_by_username(session=session, username=form_data.username)

    # 2. Verify password
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Gather permissions
    permissions = []
    if user.role and user.role.permissions:
        permissions = [p.name for p in user.role.permissions]
    
    # 4. Create token payload and generate token
    token_data = {
        "sub": user.username,
        "role": user.role.name if user.role else None,
        "permissions": permissions
    }
    
    access_token = create_access_token(data=token_data)
    return Token(access_token=access_token, token_type="bearer")
