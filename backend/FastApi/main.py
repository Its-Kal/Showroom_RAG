import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, Field, create_engine, select, Relationship
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated, List, Optional

# --- START: ALL LOGIC IN ONE FILE ---

# 1. Load Environment Variables
load_dotenv()

# 2. Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 3. Database Models (Now with full relationships)

# Link table for the many-to-many relationship
class RolePermission(SQLModel, table=True):
    __tablename__ = "role_permissions"
    role_id: int = Field(foreign_key="roles.id", primary_key=True)
    permission_id: int = Field(foreign_key="permissions.id", primary_key=True)

class Permission(SQLModel, table=True):
    __tablename__ = "permissions"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: str | None = None
    roles: List["Role"] = Relationship(back_populates="permissions", link_model=RolePermission)

class Role(SQLModel, table=True):
    __tablename__ = "roles"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    users: List["User"] = Relationship(back_populates="role")
    permissions: List[Permission] = Relationship(back_populates="roles", link_model=RolePermission)

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    email: str = Field(unique=True)
    is_active: bool = Field(default=True)
    role_id: int | None = Field(default=None, foreign_key="roles.id")
    role: Optional[Role] = Relationship(back_populates="users")

class Car(SQLModel, table=True):
    __tablename__ = "cars"
    id: int | None = Field(default=None, primary_key=True)
    name: str
    year: int
    price: float
    description: str
    image: str | None = None
    category: str | None = None
    status: str | None = None
    acceleration: str | None = None
    fuel_consumption: str | None = Field(default=None)

# 4. Pydantic Models for API
class Token(SQLModel):
    access_token: str
    token_type: str

class CarRead(SQLModel):
    id: int
    name: str
    year: int
    price: float
    description: str
    image: str | None = None

# 5. Security Utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 6. Database Engine and Session
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

# 7. FastAPI App Initialization
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 8. API Endpoints

@app.post("/users/login", response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Annotated[Session, Depends(get_session)]):
    # Find the user by username
    user_statement = select(User).where(User.username == form_data.username)
    user = session.exec(user_statement).first()

    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    # --- NEW: Fetch user's permissions --- #
    permissions = []
    if user.role and user.role.permissions:
        permissions = [p.name for p in user.role.permissions]
    
    # Create the token payload with username, role, and the list of permissions
    token_data = {
        "sub": user.username,
        "role": user.role.name if user.role else None,
        "permissions": permissions
    }
    
    access_token = create_access_token(data=token_data)
    return Token(access_token=access_token, token_type="bearer")

@app.get("/cars", response_model=List[CarRead])
def get_all_cars(session: Annotated[Session, Depends(get_session)]):
    cars = session.exec(select(Car)).all()
    return cars

@app.get("/cars/{car_id}", response_model=CarRead)
def get_car_by_id(car_id: int, session: Annotated[Session, Depends(get_session)]):
    car = session.get(Car, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

# --- END: ALL LOGIC IN ONE FILE ---