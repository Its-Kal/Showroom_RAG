from typing import List
from fastapi import Depends, HTTPException, status

# Use absolute import
from auth.security import get_current_user
from models.user_model import User, UserRoleEnum

def require_permission(allowed_roles: List[UserRoleEnum]):
    """
    This is a dependency factory. It creates a dependency
    that checks if the current user has one of the allowed roles.
    """
    def check_roles(current_user: User = Depends(get_current_user)):
        if not current_user.role or current_user.role.name not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
    return check_roles
