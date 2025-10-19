from fastapi import HTTPException, UploadFile
from sqlmodel import Session
import json
import os
from datetime import datetime

from schemas import CarCreate, CarUpdate
from models.car_model import Car
import repositories.car_repository as car_repo
from controllers.utils import save_upload_file, UPLOAD_DIR
from typing import List

def get_all_cars(db: Session) -> List[Car]:
    """Business logic to retrieve all cars."""
    return car_repo.get_all_cars(session=db)

def get_car_by_id(car_id: int, db: Session) -> Car:
    """Business logic to retrieve a single car by its ID."""
    car = car_repo.find_car_by_id(session=db, car_id=car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

def create_new_car(
    db: Session,
    name: str, year: int, price: float, category: str, status: str,
    acceleration: str, fuel_consumption: str, description: str,
    images: str, specifications: str, image: UploadFile
) -> Car:
    """Business logic to create a new car with validation and an image upload."""
    # Level 2 Validation: Business Logic & Security
    clean_name = name.strip()
    if not clean_name:
        raise HTTPException(status_code=400, detail="Car name cannot be empty.")
    if year > datetime.now().year + 1:
        raise HTTPException(status_code=400, detail="Invalid year.")
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive.")

    try:
        images_list = json.loads(images)
        specifications_dict = json.loads(specifications)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for images or specifications.")

    # Handle main image upload
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    save_upload_file(image, image_path)
    image_url = f"/uploads/{image.filename}"

    # Create CarCreate instance with validated and sanitized data
    car_data = {
        "name": clean_name, "year": year, "price": price, "category": category,
        "status": status, "acceleration": acceleration, "fuel_consumption": fuel_consumption,
        "description": description, "image": image_url,
        "images": images_list, "specifications": specifications_dict,
    }
    car_create = CarCreate(**car_data)

    # Pass clean data to repository
    return car_repo.add_car(session=db, car_create=car_create)


def update_existing_car(
    db: Session, car_id: int,
    name: str, year: int, price: float, category: str, status: str,
    acceleration: str, fuel_consumption: str, description: str,
    images: str, specifications: str, image: UploadFile | None
) -> Car:
    """Business logic to update an existing car with validation."""
    car = car_repo.find_car_by_id(session=db, car_id=car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    # Level 2 Validation: Business Logic & Security
    clean_name = name.strip()
    if not clean_name:
        raise HTTPException(status_code=400, detail="Car name cannot be empty.")
    if year > datetime.now().year + 1:
        raise HTTPException(status_code=400, detail="Invalid year.")
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive.")

    try:
        images_list = json.loads(images)
        specifications_dict = json.loads(specifications)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for images or specifications.")

    update_data = {
        "name": clean_name, "year": year, "price": price, "category": category,
        "status": status, "acceleration": acceleration, "fuel_consumption": fuel_consumption,
        "description": description, "images": images_list,
        "specifications": specifications_dict,
    }

    if image:
        image_path = os.path.join(UPLOAD_DIR, image.filename)
        save_upload_file(image, image_path)
        update_data["image"] = f"/uploads/{image.filename}"

    car_update = CarUpdate(**update_data)
    return car_repo.update_car_in_db(
        session=db, car_id=car_id, car_update=car_update
    )

def delete_car_by_id(car_id: int, db: Session) -> dict:
    """Business logic to delete a car."""
    success = car_repo.delete_car_from_db(session=db, car_id=car_id)
    if not success:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}
