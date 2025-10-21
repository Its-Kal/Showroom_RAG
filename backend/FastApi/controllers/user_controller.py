from fastapi import HTTPException, status
from sqlmodel import Session
from repositories import user_repository
from models.user_model import UserLogin

# In a real-world application, you would use a proper password hashing library
# like passlib. For this example, we'll assume plain text for simplicity,
# but this is NOT secure.
# from passlib.context import CryptContext
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def login_user(session: Session, user_in: UserLogin):
    """
    Controller logic to handle user login.
    1. Fetches the user by username.
    2. Verifies the password.
    3. Returns the user object on success or raises an error.
    """
    # Get the user from the database via the repository
    db_user = user_repository.get_user_by_username(session=session, username=user_in.username)

    # Business logic: Check if user exists and if the password is correct
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Incorrect username or password"
        )

    # IMPORTANT: This is an insecure plain text password comparison.
    # In a real app, you MUST use a hashing function like:
    # if not pwd_context.verify(user_in.password, db_user.hashed_password):
    if user_in.password != db_user.password: # Assuming plain text password for now
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # In a real app, you would generate and return a JWT token here.
    # For now, we return a simple success message with user details.
    return {"message": f"Welcome {db_user.full_name}! Login successful."}
