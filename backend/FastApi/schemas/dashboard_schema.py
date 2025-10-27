from pydantic import BaseModel
from typing import List


class SalesDataPoint(BaseModel):
    tanggal: str  # Format YYYY-MM-DD
    total_penjualan: int

    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    total_cars: int
    total_users: int
    recent_activities: List[str]

    class Config:
        from_attributes = True
