import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, Field, create_engine, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated, List

# --- START: ALL LOGIC IN ONE FILE ---

# 1. Load Environment Variables
load_dotenv()

# 2. Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 3. Database Models
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str

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
    fuel_consumption: str | None = Field(default=None, alias="fuelConsumption")

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
    fuel_consumption: str | None = Field(default=None, alias="fuelConsumption")

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
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    role = "unknown"
    if "admin" in user.username: role = "admin"
    elif "sales" in user.username: role = "sales"
    token_data = {"sub": user.username, "role": role}
    access_token = create_access_token(data=token_data)
    return Token(access_token=access_token, token_type="bearer")

@app.get("/cars", response_model=List[CarRead])
def get_all_cars(session: Annotated[Session, Depends(get_session)]):
    cars = session.exec(select(Car)).all()
    return cars

# ADDED: Endpoint to get a single car by ID
@app.get("/cars/{car_id}", response_model=CarRead)
def get_car_by_id(car_id: int, session: Annotated[Session, Depends(get_session)]):
    car = session.get(Car, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

# --- END: ALL LOGIC IN ONE FILE ---