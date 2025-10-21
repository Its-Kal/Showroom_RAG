from fastapi import HTTPException, status
from sqlmodel import Session
from repositories import car_repository
from models.car_model import CarCreate, CarUpdate

def create_new_car(session: Session, car_in: CarCreate):
    """
    Controller logic to create a new car.
    It simply calls the repository to perform the database operation.
    """
    return car_repository.create_car(session=session, car_in=car_in)

def get_all_cars(session: Session, skip: int = 0, limit: int = 100):
    """
    Controller logic to get all cars with pagination.
    """
    cars = car_repository.get_all_cars(session=session, skip=skip, limit=limit)
    return cars

def get_car_by_id(session: Session, car_id: int):
    """
    Controller logic to get a single car by its ID.
    It includes a business logic check: if the car doesn't exist, raise an error.
    """
    db_car = car_repository.get_car_by_id(session=session, car_id=car_id)
    if not db_car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    return db_car

def update_existing_car(session: Session, car_id: int, car_in: CarUpdate):
    """
    Controller logic to update a car.
    It first fetches the car to ensure it exists, then calls the repository to update it.
    """
    # First, get the existing car object from the DB
    db_car = car_repository.get_car_by_id(session=session, car_id=car_id)
    if not db_car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    # Now, call the repository to perform the update
    return car_repository.update_car(session=session, db_car=db_car, car_in=car_in)

def delete_car_by_id(session: Session, car_id: int):
    """
    Controller logic to delete a car.
    It first checks if the car exists before attempting to delete it.
    """
    db_car = car_repository.get_car_by_id(session=session, car_id=car_id)
    if not db_car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    car_repository.delete_car(session=session, car_id=car_id)
    
    # It's good practice to return a confirmation message
    return {"message": f"Car with id {car_id} deleted successfully"}
