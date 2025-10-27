import os
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, Field, create_engine, select
from passlib.context import CryptContext

# --- START: Self-contained definitions ---

# Password hashing function
def get_password_hash(password: str) -> str:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password[:72])

# Database models matching your exact table structure
class Role(SQLModel, table=True):
    __tablename__ = "roles"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    email: str = Field(unique=True)
    is_active: bool = Field(default=True)
    role_id: int | None = Field(default=None, foreign_key="roles.id")

# --- END: Self-contained definitions ---


# Load environment variables
load_dotenv()

# Get the database URL
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file. Please ensure it is set correctly.")

# Create database engine
engine = create_engine(DATABASE_URL)

def create_user_in_db(username: str, email: str, plain_password: str, role_id: int):
    """
    Creates a new user if they don't exist.
    """
    with Session(engine) as session:
        # Check if user already exists
        statement = select(User).where(User.username == username)
        existing_user = session.exec(statement).first()
        if existing_user:
            print(f"INFO: User '{username}' already exists. Skipping creation.")
            return

        # Check if the role exists
        role = session.get(Role, role_id)
        if not role:
            print(f"ERROR: Role with id {role_id} not found. User '{username}' not created.")
            return

        hashed_password = get_password_hash(plain_password)
        new_user = User(
            username=username,
            password=hashed_password,
            email=email,
            is_active=True,
            role_id=role_id
        )
        
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        print(f"--- USER '{username}' CREATED SUCCESSFULLY ---")

if __name__ == "__main__":
    print("Starting user recreation script...")
    
    # Create AdminUtama
    create_user_in_db(
        username="admin_utama",
        email="admin_utama@example.com",
        plain_password="admin123",
        role_id=1
    )

    # Create Admin
    create_user_in_db(
        username="admin",
        email="admin@example.com",
        plain_password="admin456",
        role_id=2
    )

    # Create Sales
    create_user_in_db(
        username="sales",
        email="sales@example.com",
        plain_password="sales123",
        role_id=3
    )

    print("Script finished.")
