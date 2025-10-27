import os
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, Field, create_engine
from passlib.context import CryptContext

# --- START: Self-contained definitions ---

# Password hashing function
def get_password_hash(password: str) -> str:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password[:72])

# Simplified User model to match your database
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str  # The column in your DB that stores the hash

# --- END: Self-contained definitions ---

# Load environment variables
load_dotenv()

# Get the database URL
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file.")

# Create database engine
engine = create_engine(DATABASE_URL)

def create_user_in_db(username: str, plain_password: str):
    hashed_password = get_password_hash(plain_password)
    new_user = User(username=username, password=hashed_password)
    
    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"INFO: User '{username}' already exists. Updating password.")
            existing_user.password = hashed_password
            session.add(existing_user)
        else:
            print(f"INFO: User '{username}' not found. Creating new user.")
            session.add(new_user)
        
        session.commit()
        print(f"--- SUCCESS: User '{username}' is now in the database with the correct password hash. ---")

if __name__ == "__main__":
    print("Starting user creation/update script...")
    
    # We will create/update the 'sales' user with the password 'sales123'
    create_user_in_db(
        username="sales",
        plain_password="sales123"
    )

    print("Script finished.")
