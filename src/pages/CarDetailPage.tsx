import React from 'react';
import { useParams } from 'react-router-dom';
import CarDetail from '../components/CarDetail';
import NotFoundPage from './NotFoundPage';
import { mockCars } from '../components/CollectionSection';
import { CarDetailData } from '../types/Car';

// Data tambahan yang hanya ada di halaman detail
const carDetailsData = {
    1: { // id mobil: 1
        description: 'Sedan mewah flagship dari BMW yang menawarkan kombinasi sempurna antara kenyamanan, teknologi, dan performa.',
        images: ['https://via.placeholder.com/400x300/00008B/FFFFFF?text=BMW+View+1', 'https://via.placeholder.com/400x300/00008B/FFFFFF?text=BMW+View+2'],
        specifications: { engine: '4.4L V8 Twin-Turbo', transmission: '8-Speed Automatic', fuel: 'Bensin' }
    },
    2: { // id mobil: 2
        description: 'SUV mewah berukuran penuh yang menetapkan standar baru untuk ruang, kenyamanan, dan kemewahan di kelasnya.',
        images: ['https://via.placeholder.com/400x300/E0E0E0/000000?text=Mercedes+View+1'],
        specifications: { engine: '4.0L V8 Biturbo with EQ Boost', transmission: '9G-TRONIC Automatic', fuel: 'Bensin' }
    },
    3: { // id mobil: 3
        description: 'Mobil listrik dengan akselerasi tercepat di dunia, menggabungkan performa supercar dengan kepraktisan sedan.',
        images: ['https://via.placeholder.com/400x300/DC143C/FFFFFF?text=Tesla+View+1'],
        specifications: { engine: 'Dual Motor All-Wheel Drive', transmission: '1-Speed Automatic', fuel: 'Listrik' }
    }
};

const CarDetailPage = () => {
    const { carId } = useParams<{ carId: string }>();
    const carBaseData = mockCars.find(car => car.id.toString() === carId);

    if (!carId || !carBaseData) {
        return <NotFoundPage />;
    }

    const details = carDetailsData[carBaseData.id as keyof typeof carDetailsData];

    // Tambahkan anotasi tipe di sini
    const fullCarData: CarDetailData = {
        ...carBaseData,
        ...details
    };

    return (
        <div>
            <CarDetail car={fullCarData} />
        </div>
    );
};

export default CarDetailPage;