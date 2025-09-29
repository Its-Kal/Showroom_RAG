import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types/Car';
import '../App.css';

const FeaturedCars = React.forwardRef<HTMLElement>((_, ref) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:8000/cars');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data mobil');
                }
                const allCars: Car[] = await response.json();
                setCars(allCars.slice(0, 3));
            } catch (err) {
                setError('Tidak dapat memuat mobil unggulan.');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <section id="featured" className="featured-cars" ref={ref}>
            <h2>Mobil Unggulan Kami</h2>
            <div className="car-list">
                {loading && <p>Memuat mobil...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && cars.map((car) => (
                    <Link to={`/koleksi/${car.id}`} key={car.id} className="car-card">
                        <img src={car.image} alt={car.name} />
                        <h3>{car.name}</h3>
                        <p>{car.description}</p>
                        <p className="price">{car.price}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
});

export default FeaturedCars;
