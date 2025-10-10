from fastapi import HTTPException, UploadFile
from typing import List
import requests

from models.car_model import Car, UpdateCar
import repositories.car_repository as car_repo


def get_all_cars() -> List[Car]:
    return car_repo.get_all_cars()

def get_car_by_id(car_id: int) -> Car:
    car = car_repo.find_car_by_id(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

async def create_new_car(
    car_name: str,
    car_price: str,
    car_desc: str,
    pdf_file: UploadFile
) -> dict:
    webhook_url = ""  # Please provide the correct webhook URL
    car_db = car_repo.get_all_cars()
    new_id = max((car.id for car in car_db), default=0) + 1
    
    new_car = Car(
        id=new_id,
        name=car_name,
        year="2024",
        price=car_price,
        description=car_desc,
        image=f"https://via.placeholder.com/400x300/808080/FFFFFF?text={car_name.replace(' ', '+')}",
        category="new",
        status="available",
        acceleration="N/A",
        fuelConsumption="N/A",
        images=[],
        specifications={}
    )
    
    car_repo.add_car(new_car)

    try:
        files = {'file': (pdf_file.filename, await pdf_file.read(), pdf_file.content_type)}
        payload = {'car_name': car_name, 'car_price': car_price, 'car_desc': car_desc}
        response = requests.post(webhook_url, files=files, data=payload)
        response.raise_for_status()
        return {"message": "Car added and file sent to webhook successfully"}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Car added, but failed to send to webhook: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

def update_existing_car(car_id: int, car_update: UpdateCar) -> Car:
    updated_car = car_repo.update_car_in_db(car_id, car_update)
    if not updated_car:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated_car

def delete_existing_car(car_id: int) -> dict:
    if not car_repo.delete_car_from_db(car_id):
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}
