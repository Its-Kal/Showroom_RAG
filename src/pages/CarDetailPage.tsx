import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CarDetail from '../components/CarDetail';
import Footer from '../components/Footer';

const CarDetailPage = () => {
    const { carId } = useParams<{ carId: string }>();

    // Di sini kamu akan mengambil data mobil dari API menggunakan carId
    // Untuk sementara, kita gunakan data dummy
    const carData = {
        id: carId,
        name: 'SUV Modern', // Seharusnya diambil dari API
        price: 'Rp 450.000.000', // Seharusnya diambil dari API
        description: 'Kenyamanan dan gaya bertemu dalam SUV canggih ini. Dilengkapi dengan fitur-fitur terbaru untuk pengalaman berkendara yang tak tertandingi.', // Deskripsi lebih panjang
        images: [
            'url_gambar_1.jpg', // URL gambar dari API
            'url_gambar_2.jpg',
            'url_gambar_3.jpg'
        ],
        specifications: {
            engine: '2.0L Turbo',
            transmission: 'Automatic',
            fuel: 'Bensin'
        }
    };

    return (
        <div>
            <CarDetail car={carData} />
        </div>
    );
};

export default CarDetailPage;