import React, { useState, useEffect } from 'react';
import CarCard from './CarCard';
import { Car } from '../types/Car';

// ⚠️ HANYA UNTUK DEVELOPMENT — dummy data sementara
// Nanti akan diganti dengan fetch dari API
export const mockCars: Car[] = [
    {
        id: 1,
        name: 'BMW 750Li xDrive',
        year: '2024',
        price: 'Rp 1.425.000.000',
        // Gunakan 'image' (tunggal) untuk thumbnail
        image: 'https://via.placeholder.com/400x300/00008B/FFFFFF?text=BMW+750Li',
        category: 'luxury',
        status: 'available',
        acceleration: '0-100 km/h in 4.2s',
        fuelConsumption: '10.2L/100km'
    },
    {
        id: 2,
        name: 'Mercedes-Benz GLS 580',
        year: '2024',
        price: 'Rp 1.650.000.000',
        image: 'https://via.placeholder.com/400x300/E0E0E0/000000?text=Mercedes+GLS',
        category: 'SUV',
        status: 'available',
        acceleration: '0-100 km/h in 4.9s',
        fuelConsumption: '11.8L/100km'
    },
    {
        id: 3,
        name: 'Tesla Model S Plaid',
        year: '2024',
        price: 'Rp 2.025.000.000',
        image: 'https://via.placeholder.com/400x300/DC143C/FFFFFF?text=Tesla+Model+S',
        category: 'electric',
        status: 'reserved',
        acceleration: '0-100 km/h in 2.1s',
        fuelConsumption: '0 L/100km'
    }
];

const CollectionSection: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Semua');

  // Simulasi fetch data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ganti ini dengan: const response = await fetch('/api/cars');
        // const data: Car[] = await response.json();
        
        // Untuk sekarang, pakai mock data
        setTimeout(() => {
          setCars(mockCars);
          setLoading(false);
        }, 800); // simulasi delay

      } catch (err) {
        setError('Gagal memuat data mobil.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCars = filter === 'Semua'
    ? cars
    : cars.filter(car => car.category.toLowerCase() === filter.toLowerCase());

  const categories = ['Semua', 'Mewah', 'SUV', 'Sport', 'Listrik'];

  if (loading) {
    return <div className="collection-section"><p>Memuat koleksi mobil...</p></div>;
  }

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
            {cat} ({cars.filter(c => c.category.toLowerCase() === cat.toLowerCase()).length})
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