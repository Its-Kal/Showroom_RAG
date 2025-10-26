from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database setup
from db import create_db_and_tables

# Import routers
from routes import car_routes, user_routes, dashboard_routes

# Import models to ensure they are registered with Base
from models import car_model, user_model

# --- App Initialization ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database and tables on startup
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# --- Static Files ---
# The /uploads path is now relative to the root of the project
app.mount("/uploads", StaticFiles(directory="backend/FastApi/uploads"), name="uploads")

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

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the UAS Showroom API"}

# --- Include Routers ---
app.include_router(car_routes.router)
app.include_router(user_routes.router)
app.include_router(dashboard_routes.router, prefix="/api/v1", tags=["Dashboard"])
