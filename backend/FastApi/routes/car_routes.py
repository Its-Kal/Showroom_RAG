from fastapi import APIRouter, Form, UploadFile, File, Depends
from typing import List

from models.car_model import Car, UpdateCar
import controllers.car_controller as car_controller

router = APIRouter()

@router.get("/cars", response_model=List[Car])
def get_cars():
    return car_controller.get_all_cars()

@router.get("/cars/{car_id}", response_model=Car)
def get_car(car_id: int):
    return car_controller.get_car_by_id(car_id)

@router.post("/upload_car")
async def upload_car(
    car_name: str = Form(...),
    car_price: str = Form(...),
    car_desc: str = Form(...),
    pdf_file: UploadFile = File(...)
):
    return await car_controller.create_new_car(car_name, car_price, car_desc, pdf_file)

@router.put("/cars/{car_id}", response_model=Car)
async def update_car_details(
    car_id: int,
    car_update: UpdateCar = Depends()
):
    # This is a simplified way to handle the update. 
    # In a real application, you might want to pass the form data directly to the controller.
    car_update_data = UpdateCar(
        name=car_update.name,
        price=car_update.price,
        description=car_update.description
    )
    return car_controller.update_existing_car(car_id, car_update_data)

@router.delete("/cars/{car_id}")
def delete_car(car_id: int):
    return car_controller.delete_existing_car(car_id)
