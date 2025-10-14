from typing import List, Dict, Optional
from sqlmodel import Field, SQLModel, JSON, Column

# Database Model (SQLModel)
# This model represents the 'cars' table in the database.
class Car(SQLModel, table=True):
    __tablename__ = "cars"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    year: int
    price: float
    image: str
    category: str
    status: str
    acceleration: str
    fuelConsumption: str
    description: str
    images: List[str] = Field(sa_column=Column(JSON))
    specifications: Dict[str, str] = Field(sa_column=Column(JSON))

# API Models (Pydantic-style)
# These models are used for request and response validation in the API.

# Model for creating a new car (input)
class CarCreate(SQLModel):
    name: str
    year: int
    price: float
    image: str
    category: str
    status: str
    acceleration: str
    fuelConsumption: str
    description: str
    images: List[str]
    specifications: Dict[str, str]

# Model for reading a car (output)
class CarRead(SQLModel):
    id: int
    name: str
    year: int
    price: float
    image: str
    category: str
    status: str
    acceleration: str
    fuelConsumption: str
    description: str
    images: List[str]
    specifications: Dict[str, str]

# Model for updating a car (input, all fields optional)
class CarUpdate(SQLModel):
    name: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None
    status: Optional[str] = None
    acceleration: Optional[str] = None
    fuelConsumption: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None