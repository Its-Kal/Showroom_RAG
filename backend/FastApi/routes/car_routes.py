# FILE: routes/car_routes.py (VERSI LENGKAP SETELAH DIPERBAIKI)

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session

from db import get_db
from schemas_definition import CarRead
import controllers.car_controller as car_controller
from auth import require_permission

router = APIRouter(
    prefix="/cars",
    tags=["Cars"],
)

@router.get("/", response_model=List[CarRead], dependencies=[Depends(require_permission("CAN_VIEW_CARS"))])
def get_cars(db: Session = Depends(get_db)):
    """Endpoint to retrieve all cars."""
    return car_controller.get_all_cars(db=db)

@router.get("/{car_id}", response_model=CarRead, dependencies=[Depends(require_permission("CAN_VIEW_CARS"))])
def get_car(car_id: int, db: Session = Depends(get_db)):
    """Endpoint to retrieve a single car by its ID."""
    return car_controller.get_car_by_id(car_id=car_id, db=db)

@router.post("/", 
             response_model=CarRead, 
             status_code=201,
             dependencies=[Depends(require_permission("CAN_CREATE_CARS"))])
def create_car(
    name: str = Form(...),
    year: int = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    status: str = Form(...),
    acceleration: str = Form(...),
    fuel_consumption: str = Form(..., alias="fuelConsumption"),
    description: str = Form(...),
    images: str = Form(...),  # JSON string of a list of image URLs
    specifications: str = Form(...),  # JSON string of a dict
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Endpoint to create a new car with an image upload."""
    return car_controller.create_new_car(
        db=db, name=name, year=year, price=price, category=category,
        status=status, acceleration=acceleration, fuel_consumption=fuel_consumption,
        description=description, images=images, specifications=specifications, image=image
    )

@router.put("/{car_id}", 
            response_model=CarRead,
            dependencies=[Depends(require_permission("CAN_EDIT_CARS"))])
def update_car(
    car_id: int,
    name: str = Form(...),
    year: int = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    status: str = Form(...),
    acceleration: str = Form(...),
    fuel_consumption: str = Form(..., alias="fuelConsumption"),
    description: str = Form(...),
    images: str = Form(...),  # JSON string
    specifications: str = Form(...),  # JSON string
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Endpoint to update an existing car."""
    return car_controller.update_existing_car(
        db=db, car_id=car_id, name=name, year=year, price=price,
        category=category, status=status, acceleration=acceleration,
        fuel_consumption=fuel_consumption, description=description, images=images,
        specifications=specifications, image=image
    )

@router.delete("/{car_id}", status_code=204, dependencies=[Depends(require_permission("CAN_DELETE_CARS"))])
def delete_car(car_id: int, db: Session = Depends(get_db)):
    """Endpoint to delete a car."""
    car_controller.delete_car_by_id(car_id=car_id, db=db)
    return {"message": "Car deleted successfully"}