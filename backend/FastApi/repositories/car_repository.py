from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from models.car_model import Car
from schemas_definition import CarCreate, CarUpdate

def get_all_cars(session: Session) -> List[Car]:
    return session.execute(select(Car)).scalars().all()

def find_car_by_id(session: Session, car_id: int) -> Car | None:
    return session.get(Car, car_id)

def add_car(session: Session, car_create: CarCreate) -> Car:
    new_car = Car(**car_create.model_dump())
    session.add(new_car)
    session.commit()
    session.refresh(new_car)
    return new_car

def update_car_in_db(session: Session, car_id: int, car_update: CarUpdate) -> Car | None:
    car = session.get(Car, car_id)
    if car:
        update_data = car_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(car, key, value)
        session.add(car)
        session.commit()
        session.refresh(car)
    return car

def delete_car_from_db(session: Session, car_id: int) -> bool:
    car = session.get(Car, car_id)
    if car:
        session.delete(car)
        session.commit()
        return True
    return False
