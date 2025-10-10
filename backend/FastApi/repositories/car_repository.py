import json
from typing import List
from models.car_model import Car, UpdateCar

CAR_FILE = "cars.json"

def load_car_data() -> List[Car]:
    try:
        with open(CAR_FILE, "r") as f:
            data = json.load(f)
            return [Car(**car) for car in data]
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_car_data(cars: List[Car]):
    with open(CAR_FILE, "w") as f:
        json.dump([car.dict() for car in cars], f, indent=2)

car_db = load_car_data()

def get_all_cars() -> List[Car]:
    return car_db

def find_car_by_id(car_id: int) -> Car | None:
    return next((car for car in car_db if car.id == car_id), None)

def find_car_index(car_id: int) -> int:
    return next((i for i, car in enumerate(car_db) if car.id == car_id), -1)

def add_car(car: Car):
    car_db.append(car)
    save_car_data(car_db)

def update_car_in_db(car_id: int, car_update: UpdateCar) -> Car | None:
    car_index = find_car_index(car_id)
    if car_index == -1:
        return None
    
    car = car_db[car_index]
    update_data = car_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(car, key, value)
    
    save_car_data(car_db)
    return car

def delete_car_from_db(car_id: int) -> bool:
    original_len = len(car_db)
    global car_db
    car_db = [car for car in car_db if car.id != car_id]
    if len(car_db) < original_len:
        save_car_data(car_db)
        return True
    return False
