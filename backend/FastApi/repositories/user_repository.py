import bcrypt
from sqlmodel import Session, select
from models.user_model import User, UserCreate

# --- Password Hashing Utilities ---

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed one."""
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password=password_byte_enc, hashed_password=hashed_password_byte_enc)

# --- Repository Functions ---

def get_user_by_username(session: Session, username: str) -> User | None:
    """Fetches a user by their username."""
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def register_user(session: Session, user_create: UserCreate) -> User:
    """Creates a new user in the database."""
    # Hash the password before storing
    hashed_pwd = hash_password(user_create.password)
    
    # Create a new User instance with the hashed password
    db_user = User(username=user_create.username, password=hashed_pwd)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def authenticate_user(session: Session, username: str, password: str) -> User | None:
    """Authenticates a user. Returns the user object if successful, else None."""
    db_user = get_user_by_username(session, username)
    if not db_user:
        return None
    
    if not verify_password(plain_password=password, hashed_password=db_user.password):
        return None
        
    return db_user