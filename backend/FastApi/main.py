from fastapi import FastAPI, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from typing import List, Dict, Any, Optional
from sqlmodel import Field, Session, SQLModel, create_engine, select
from dotenv import load_dotenv
from contextlib import asynccontextmanager
load_dotenv()

from database.config import create_db_and_tables, SessionDep

# --- Models ---
class UserModel(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(default=None, primary_key=True)
    username: str
    password: str

class User(BaseModel):
    username: str
    password: str

class Car(BaseModel):
    id: int
    name: str
    year: str
    price: str
    image: str
    category: str
    status: str
    acceleration: str
    fuelConsumption: str
    description: str
    images: List[str]
    specifications: Dict[str, str]

class UpdateCar(BaseModel):
    name: Optional[str] = None
    year: Optional[str] = None
    price: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    acceleration: Optional[str] = None
    fuelConsumption: Optional[str] = None
    description: Optional[str] = None

# --- App Initialization ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Loading ---
def load_car_data() -> List[Car]:
    try:
        with open("cars.json", "r") as f:
            data = json.load(f)
            return [Car(**car) for car in data]
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_car_data(cars: List[Car]):
    with open("cars.json", "w") as f:
        json.dump([car.dict() for car in cars], f, indent=2)

car_db = load_car_data()

dummy_users_db = {
    "user1": {
        "username": "user1",
        "password": "password123",
        "full_name": "John Doe",
    }
}

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the UAS Showroom API"}

@app.get("/dimas")
def read_root(session: SessionDep):
    data = session.exec(select(UserModel)).all()
    return data

# --- Car Endpoints ---
@app.get("/cars", response_model=List[Car])
def get_cars():
    return car_db

@app.get("/cars/{car_id}", response_model=Car)
def get_car(car_id: int):
    car = next((car for car in car_db if car.id == car_id), None)
    if not car:
        
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@app.post("/upload_car")
async def upload_car(
    car_name: str = Form(...),
    car_price: str = Form(...),
    car_desc: str = Form(...),
    pdf_file: UploadFile = File(...)
):
    webhook_url = "" # Please provide the correct webhook URL
    new_id = max((car.id for car in car_db), default=0) + 1
    new_car = Car(
        id=new_id,
        name=car_name,
        year="2024", price=car_price, description=car_desc,
        image=f"https://via.placeholder.com/400x300/808080/FFFFFF?text={car_name.replace(' ', '+')}",
        category="new", status="available", acceleration="N/A", fuelConsumption="N/A",
        images=[], specifications={}
    )
    car_db.append(new_car)
    save_car_data(car_db)

    try:
        files = {'file': (pdf_file.filename, await pdf_file.read(), pdf_file.content_type)}
        payload = {'car_name': car_name, 'car_price': car_price, 'car_desc': car_desc}
        response = requests.post(webhook_url, files=files, data=payload)
        response.raise_for_status()
        return {"message": "Car added and file sent to webhook successfully"}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Car added, but failed to send to webhook: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.put("/cars/{car_id}", response_model=Car)
async def update_car_details(
    car_id: int,
    car_name: str = Form(...),
    car_price: str = Form(...),
    car_desc: str = Form(...)
):
    car_index = next((i for i, car in enumerate(car_db) if car.id == car_id), -1)
    if car_index == -1:
        raise HTTPException(status_code=404, detail="Car not found")

    car = car_db[car_index]
    car.name = car_name
    car.price = car_price
    car.description = car_desc
    # Update other fields as necessary
    
    save_car_data(car_db)
    return car

@app.delete("/cars/{car_id}")
def delete_car(car_id: int):
    global car_db
    original_len = len(car_db)
    car_db = [car for car in car_db if car.id != car_id]
    if len(car_db) == original_len:
        raise HTTPException(status_code=404, detail="Car not found")
    save_car_data(car_db)
    return {"message": "Car deleted successfully"}

# --- Login Endpoint ---
@app.post("/login")
def login(user: User):
    db_user = dummy_users_db.get(user.username)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": f"Welcome {db_user['full_name']}! Login successful."}
