import React, { useState, useEffect, useRef } from 'react';
import CarCard from './CarCard';
import { Car } from '../types/Car';
import { useLoading } from '../contexts/LoadingContext';

// Inline SVG Icons for Slider Navigation
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

const CollectionSection: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Semua');
  const { showLoading, hideLoading } = useLoading();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll by 80% of the container width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  if (error) {
    return <div className="collection-section"><p className="error">{error}</p></div>;
  }

  const filteredCars = filter === 'Semua'
    ? cars
    : cars.filter(car => car.category.toLowerCase() === filter.toLowerCase());

  const categories = ['Semua', ...Array.from(new Set(cars.map(c => c.category)))];

  return (
    <section className="collection-section">
      <div className="collection-header-wrapper">
        <div className="collection-header">
          <h2>Koleksi Premium Kami</h2>
          <p>Pilihan kendaraan mewah dari brand terkemuka dunia dengan kualitas terbaik dan teknologi terdepan</p>
        </div>
      </div>

      <div className="collection-tabs-container">
        <div className="collection-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`tab-item ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="collection-slider-wrapper">
        <button onClick={() => scroll('left')} className="slider-btn prev" aria-label="Previous car"><ChevronLeftIcon /></button>
        <div className="collection-scroll-container" ref={scrollContainerRef}>
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <div key={car.id} className="collection-slide-item"><CarCard car={car} /></div>
            ))
          ) : (
            <p>Tidak ada mobil dalam kategori ini.</p>
          )}
        </div>
        <button onClick={() => scroll('right')} className="slider-btn next" aria-label="Next car"><ChevronRightIcon /></button>
      </div>
    </section>
  );
};

export default CollectionSection;