from pydantic import BaseModel, Field
from typing import Optional, List, Dict

# --- Role Schemas ---
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleRead(RoleBase):
    id: int

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    username: str

class UserRead(UserBase):
    id: int
    is_active: bool
    role: Optional[RoleRead] = None # Use the new RoleRead schema

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str
    role_id: int # Accept role_id instead of a complex object

class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None

# --- Car Schemas ---
class CarBase(BaseModel):
    name: str
    year: int
    price: float
    category: str
    status: str
    acceleration: str
    fuel_consumption: str = Field(alias="fuelConsumption")
    description: str
    image: str
    images: List[str]
    specifications: Dict[str, str]

class CarRead(CarBase):
    id: int
    
    class Config:
        from_attributes = True

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    name: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None
    status: Optional[str] = None
    acceleration: Optional[str] = None
    fuel_consumption: Optional[str] = Field(default=None, alias="fuelConsumption")
    description: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None