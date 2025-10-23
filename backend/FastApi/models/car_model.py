from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    year = Column(Integer)
    price = Column(Float)
    category = Column(String)
    status = Column(String)
    acceleration = Column(String)
    fuel_consumption = Column(String)
    description = Column(String)
    image = Column(String)
    images = Column(JSON)
    specifications = Column(JSON)