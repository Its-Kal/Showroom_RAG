from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session

from database.config import SessionDep
from models.car_model import CarRead, CarCreate, CarUpdate
import repositories.car_repository as car_repo

router = APIRouter(
    prefix="/cars",
    tags=["Cars"],
)

@router.get("/", response_model=List[CarRead])
def get_cars(session: SessionDep):
    """Retrieve all cars."""
    return car_repo.get_all_cars(session=session)

@router.get("/{car_id}", response_model=CarRead)
def get_car(car_id: int, session: SessionDep):
    """Retrieve a single car by its ID."""
    car = car_repo.find_car_by_id(session=session, car_id=car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post("/", response_model=CarRead, status_code=201)
def create_car(car: CarCreate, session: SessionDep):
    """Create a new car."""
    return car_repo.add_car(session=session, car_create=car)

@router.put("/{car_id}", response_model=CarRead)
def update_car(car_id: int, car_update: CarUpdate, session: SessionDep):
    """Update an existing car."""
    updated_car = car_repo.update_car_in_db(
        session=session, car_id=car_id, car_update=car_update
    )
    if not updated_car:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated_car

@router.delete("/{car_id}")
def delete_car(car_id: int, session: SessionDep):
    """Delete a car."""
    success = car_repo.delete_car_from_db(session=session, car_id=car_id)
    if not success:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}