from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.dashboard_schema import DashboardData
from controllers import car_controller, user_controller
from db import get_db

router = APIRouter()

@router.get("/dashboard-data", response_model=DashboardData)
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Endpoint to get aggregated data for the admin dashboard.
    """
    total_cars = car_controller.get_car_count(db)
    total_users = user_controller.get_user_count(db)
    
    # For simplicity, recent activities can be a static list for now
    recent_activities = [
        "User 'john.doe' logged in.",
        "New car 'Toyota Camry' was added.",
        "User 'jane.doe' updated their profile."
    ]
    
    return {
        "total_cars": total_cars,
        "total_users": total_users,
        "recent_activities": recent_activities
    }
