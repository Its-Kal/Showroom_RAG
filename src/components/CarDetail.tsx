// Di dalam src/components/CarDetail.tsx
import React from 'react';

// Definisikan tipe data untuk mobil agar lebih terstruktur
interface Car {
    id: string | undefined;
    name: string;
    price: string;
    description: string;
    images: string[];
    specifications: {
        engine: string;
        transmission: string;
        fuel: string;
    };
}

interface CarDetailProps {
    car: Car;
}

const CarDetail: React.FC<CarDetailProps> = ({ car }) => {
    return (
        <div className="car-detail-container" style={{ padding: '2rem' }}>
            <h1>{car.name}</h1>
            <div className="car-images">
                {/* Di sini kamu bisa membuat galeri gambar */}
                <img src={car.images[0]} alt={car.name} style={{ maxWidth: '100%', borderRadius: '8px' }}/>
            </div>
            <h2>Harga: {car.price}</h2>
            <h3>Deskripsi</h3>
            <p>{car.description}</p>

            <h3>Spesifikasi Utama</h3>
            <ul>
                <li>Mesin: {car.specifications.engine}</li>
                <li>Transmisi: {car.specifications.transmission}</li>
                <li>Bahan Bakar: {car.specifications.fuel}</li>
            </ul>

            {/* Kamu bisa menambahkan tombol untuk menghubungi atau test drive */}
            <button>Hubungi Kami</button>
        </div>
    );
};

export default CarDetail;