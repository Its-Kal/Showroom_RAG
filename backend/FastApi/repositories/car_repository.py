from typing import List
from sqlmodel import Session, select
from models.car_model import Car, CarCreate, CarUpdate

def get_all_cars(session: Session) -> List[Car]:
    """Fetches all cars from the database."""
    return session.exec(select(Car)).all()

def find_car_by_id(session: Session, car_id: int) -> Car | None:
    """Finds a car by its ID."""
    return session.get(Car, car_id)

def add_car(session: Session, car_create: CarCreate) -> Car:
    """Adds a new car to the database."""
    # Create a new Car instance from the CarCreate model
    db_car = Car.model_validate(car_create)
    session.add(db_car)
    session.commit()
    session.refresh(db_car)
    return db_car

def update_car_in_db(session: Session, car_id: int, car_update: CarUpdate) -> Car | None:
    """Updates an existing car in the database."""
    db_car = session.get(Car, car_id)
    if not db_car:
        return None

    # Get the update data, excluding unset fields to avoid overwriting with None
    update_data = car_update.model_dump(exclude_unset=True)
    
    # Update the model fields
    for key, value in update_data.items():
        setattr(db_car, key, value)
    
    session.add(db_car)
    session.commit()
    session.refresh(db_car)
    return db_car

def delete_car_from_db(session: Session, car_id: int) -> bool:
    """Deletes a car from the database."""
    db_car = session.get(Car, car_id)
    if not db_car:
        return False
    
    session.delete(db_car)
    session.commit()
    return True