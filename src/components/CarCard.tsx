import React, { useState } from 'react';
import { Car } from '../types/Car';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="car-card" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="car-image-wrapper">
        <img src={car.image} alt={car.name} />
        <div className={`status-badge ${car.status}`}>
          {car.status === 'available' ? 'Tersedia' : 'Dipesan'}
        </div>
        <div className="category-tag">{car.category}</div>
      </div>
      <div className="car-info">
        <h3>{car.name}</h3>
        <p className="year">{car.year}</p>
        <p className="price">{car.price}</p>
        <div className="specs">
          <span>⚡ {car.acceleration}</span>
          <span>⛽ {car.fuelConsumption}</span>
        </div>
        <button className="btn-detail">Lihat Detail</button>
      </div>
    </div>
  );
};

export default CarCard;