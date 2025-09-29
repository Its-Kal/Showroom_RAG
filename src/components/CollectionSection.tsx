import React, { useState, useEffect } from 'react';
import CarCard from './CarCard';
import { Car } from '../types/Car';
import { useLoading } from '../contexts/LoadingContext';

const CollectionSection: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Semua');
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      showLoading();
      try {
        const response = await fetch('http://localhost:8000/cars');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Car[] = await response.json();
        setCars(data);
      } catch (err) {
        setError('Gagal memuat data mobil.');
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, []);

  const filteredCars = filter === 'Semua'
    ? cars
    : cars.filter(car => car.category.toLowerCase() === filter.toLowerCase());

  const categories = ['Semua', ...Array.from(new Set(cars.map(c => c.category)))];

  if (error) {
    return <div className="collection-section"><p className="error">{error}</p></div>;
  }

  return (
    <section className="collection-section">
      <div className="collection-header">
        <h2>Koleksi Premium Kami</h2>
        <p>Pilihan kendaraan mewah dari brand terkemuka dunia dengan kualitas terbaik dan teknologi terdepan</p>
      </div>

      <div className="filters">
        <span>Filter:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'active' : ''}
          >
            {cat} ({cat === 'Semua' ? cars.length : cars.filter(c => c.category === cat).length})
          </button>
        ))}
      </div>

      <div className="car-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))
        ) : (
          <p>Tidak ada mobil yang sesuai filter.</p>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;