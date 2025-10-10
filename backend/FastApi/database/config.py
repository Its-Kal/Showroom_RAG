# In database/config.py
import os
from typing import Annotated
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel
from fastapi import Depends

load_dotenv()

# --- Database Connection Setup ---
# Make sure you have DATABASE_URL in your .env file
# Format: "postgresql://user:password@host:port/dbname"
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL environment variable set")

# 1. Create the Engine
# The `echo=True` will log SQL statements, which is useful for debugging.
engine = create_engine(DATABASE_URL, echo=True)

# 2. Function to provide a database session
def get_session():
    with Session(engine) as session:
        yield session

# 3. Dependency for getting a session
SessionDep = Annotated[Session, Depends(get_session)]

# 4. Function to create database and tables
def create_db_and_tables():
    """Creates all database tables based on SQLModel metadata."""
    SQLModel.metadata.create_all(engine)
    print("Database and tables created successfully.")
