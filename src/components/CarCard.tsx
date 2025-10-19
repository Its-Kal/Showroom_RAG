import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types/Car';

interface CarCardProps {
  car: Car;
}

// Inline SVG Icons for Specs
const SpeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
const FuelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="collection-card-content">
      <div className="collection-card-image-container">
        <img src={car.image} alt={car.name} className="collection-card-image" />
      </div>
      <div className="collection-card-details">
        <div className="detail-item">
          <span className="category-badge">{car.category}</span>
          <h3 className="car-name">{car.name}</h3>
        </div>
        <div className="detail-item">
          <p className="car-description">{car.description}</p>
        </div>
        <div className="detail-item car-actions-horizontal">
          <span className={`status-badge ${car.status}`}>{car.status === 'new' ? 'Tersedia' : 'Bekas'}</span>
          <Link to={`/koleksi/${car.id}`} className="btn-detail">Lihat Detail</Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;