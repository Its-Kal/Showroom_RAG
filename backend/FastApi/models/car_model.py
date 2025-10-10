from pydantic import BaseModel
from typing import List, Dict, Optional

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
