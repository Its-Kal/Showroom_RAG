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
from sqlalchemy.orm import joinedload # Import joinedload from sqlalchemy.orm

# --- START: ALL LOGIC IN ONE FILE (GUARANTEED TO WORK) ---

# 1. Load Environment Variables
load_dotenv()

# 2. Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 3. Database Models (with full relationships)
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

# 4. Pydantic Models for API Input/Output
class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: str | None = None
    permissions: List[str] = []

class CarRead(SQLModel):
    id: int
    name: str
    year: int
    price: float
    description: str
    image: str | None = None
    category: str | None = None
    status: str | None = None
    acceleration: str | None = None
    fuel_consumption: str | None = Field(default=None)

# --- RE-ADDED: CarCreateUpdate Model ---
class CarCreateUpdate(SQLModel):
    name: str
    year: int
    price: float
    description: str
    image: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    acceleration: Optional[str] = None
    fuel_consumption: Optional[str] = None

# --- User Input/Output Models ---
class UserRead(SQLModel):
    id: int
    username: str
    email: str
    is_active: bool
    role_id: int | None = None
    role: Optional[str] = None # Only send role name

class UserCreateUpdate(SQLModel):
    username: str
    email: str
    plain_password: str # For creation, required. For update, optional.
    role_id: int
    is_active: bool = True

class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[str] = None
    plain_password: Optional[str] = None
    role_id: Optional[int] = None
    is_active: Optional[bool] = None

class RoleRead(SQLModel):
    id: int
    name: str

# 5. Security Utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password[:72])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Permission Dependency ---
def require_permission(permission: str):
    def dependency(token: str = Depends(oauth2_scheme)) -> TokenData:
        credentials_exception = HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            permissions = payload.get("permissions", [])
            if permission not in permissions:
                raise credentials_exception
            return TokenData(username=payload.get("sub"), permissions=permissions)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    return dependency

# 6. Database Engine and Session
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

# 7. FastAPI App Initialization
app = FastAPI(title="Showroom RAG API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

# 8. API Endpoints

@app.post("/users/login", response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Annotated[Session, Depends(get_session)]):
    user_statement = select(User).options(joinedload(User.role).joinedload(Role.permissions))
    user = session.exec(user_statement.where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    permissions = [p.name for p in user.role.permissions] if user.role and user.role.permissions else []
    token_data = {"sub": user.username, "role": user.role.name if user.role else None, "permissions": permissions}
    access_token = create_access_token(data=token_data)
    return Token(access_token=access_token, token_type="bearer")

# --- Car Endpoints ---
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

@app.post("/cars", response_model=CarRead, dependencies=[Depends(require_permission("CAN_CREATE_CARS"))])
def create_car(car: CarCreateUpdate, session: Annotated[Session, Depends(get_session)]):
    db_car = Car.model_validate(car)
    session.add(db_car)
    session.commit()
    session.refresh(db_car)
    return db_car

@app.put("/cars/{car_id}", response_model=CarRead, dependencies=[Depends(require_permission("CAN_EDIT_CARS"))])
def update_car(car_id: int, car: CarCreateUpdate, session: Annotated[Session, Depends(get_session)]):
    db_car = session.get(Car, car_id)
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    car_data = car.model_dump(exclude_unset=True)
    for key, value in car_data.items():
        setattr(db_car, key, value)
    session.add(db_car)
    session.commit()
    session.refresh(db_car)
    return db_car

@app.delete("/cars/{car_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permission("CAN_DELETE_CARS"))])
def delete_car(car_id: int, session: Annotated[Session, Depends(get_session)]):
    db_car = session.get(Car, car_id)
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    session.delete(db_car)
    session.commit()
    return

# --- User Endpoints ---
@app.get("/users", response_model=List[UserRead], dependencies=[Depends(require_permission("CAN_MANAGE_USERS"))])
def get_all_users(session: Annotated[Session, Depends(get_session)]):
    users = session.exec(select(User).options(joinedload(User.role))).all()
    return [
        UserRead(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            role_id=user.role_id,
            role=user.role.name if user.role else None
        ) for user in users
    ]

@app.get("/users/{user_id}", response_model=UserRead, dependencies=[Depends(require_permission("CAN_MANAGE_USERS"))])
def get_user_by_id(user_id: int, session: Annotated[Session, Depends(get_session)]):
    user = session.exec(select(User).options(joinedload(User.role)).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        is_active=user.is_active,
        role_id=user.role_id,
        role=user.role.name if user.role else None
    )

@app.post("/users", response_model=UserRead, dependencies=[Depends(require_permission("CAN_MANAGE_USERS"))])
def create_user(user_in: UserCreateUpdate, session: Annotated[Session, Depends(get_session)]):
    existing_user = session.exec(select(User).where(User.username == user_in.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_in.plain_password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        password=hashed_password,
        role_id=user_in.role_id,
        is_active=user_in.is_active
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return UserRead(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        is_active=db_user.is_active,
        role_id=db_user.role_id,
        role=db_user.role.name if db_user.role else None
    )

@app.put("/users/{user_id}", response_model=UserRead, dependencies=[Depends(require_permission("CAN_MANAGE_USERS"))])
def update_user(user_id: int, user_in: UserUpdate, session: Annotated[Session, Depends(get_session)]):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_in.model_dump(exclude_unset=True)
    if "plain_password" in user_data and user_data["plain_password"]:
        user_data["password"] = get_password_hash(user_data["plain_password"])
        del user_data["plain_password"]
    
    if "role_id" in user_data and user_data["role_id"] is not None:
        role = session.get(Role, user_data["role_id"])
        if not role:
            raise HTTPException(status_code=400, detail="Role not found")

    for key, value in user_data.items():
        setattr(db_user, key, value)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return UserRead(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        is_active=db_user.is_active,
        role_id=db_user.role_id,
        role=db_user.role.name if db_user.role else None
    )

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permission("CAN_MANAGE_USERS"))])
def delete_user(user_id: int, session: Annotated[Session, Depends(get_session)]):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(db_user)
    session.commit()
    return

# --- Role Endpoints (for frontend dropdowns) ---
@app.get("/roles", response_model=List[RoleRead])
def get_all_roles(session: Annotated[Session, Depends(get_session)]):
    roles = session.exec(select(Role)).all()
    return roles

@app.get("/")
def read_root():
    return {"message": "Welcome to the Premium Auto Showroom API"}

# --- END: ALL LOGIC IN ONE FILE ---
