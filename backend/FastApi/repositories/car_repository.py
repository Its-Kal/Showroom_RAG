from typing import List
from models.car_model import Car, UpdateCar

# Functions will be implemented after Supabase connection is established.

def get_all_cars() -> List[Car]:
    # Supabase logic to get all cars
    pass

def find_car_by_id(car_id: int) -> Car | None:
    # Supabase logic to find a car by id
    pass

def add_car(car: Car):
    # Supabase logic to add a new car
    pass

def update_car_in_db(car_id: int, car_update: UpdateCar) -> Car | None:
    # Supabase logic to update a car
    pass

def delete_car_from_db(car_id: int) -> bool:
    # Supabase logic to delete a car
    pass
