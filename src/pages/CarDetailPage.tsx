import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CarDetail from '../components/CarDetail';
import NotFoundPage from './NotFoundPage';
import { CarDetailData } from '../types/Car';
import { useLoading } from '../contexts/LoadingContext';

const CarDetailPage = () => {
    const { carId } = useParams<{ carId: string }>();
    const [car, setCar] = useState<CarDetailData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        // Scroll ke atas saat halaman dimuat
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (!carId) return;

        const fetchCarData = async () => {
            showLoading();
            try {
                const response = await fetch(`http://localhost:8000/cars/${carId}`);
                if (!response.ok) {
                    throw new Error('Car not found');
                }
                const data: CarDetailData = await response.json();
                setCar(data);
            } catch (err) {
                setError('Gagal memuat data mobil.');
            } finally {
                hideLoading();
            }
        };

        fetchCarData();
    }, [carId]);

    if (error || !car) {
        return <NotFoundPage />;
    }

    return (
        <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
            {car && <CarDetail car={car} />}
        </div>
    );
};

export default CarDetailPage;