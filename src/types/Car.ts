export type CarStatus = 'available' | 'reserved';
export type CarCategory = 'luxury' | 'SUV' | 'electric' | 'sport';

// Tipe ini akan kita gunakan untuk daftar mobil di halaman utama
export interface Car {
    id: number;
    name: string;
    year: string;
    price: string;
    image: string; // Gambar utama (thumbnail)
    category: CarCategory;
    status: CarStatus;
    acceleration: string;
    fuelConsumption: string;
}

export interface CarDetailData extends Car {
    description: string;
    images: string[]; // galeri gambar
    specifications: {
        engine: string;
        transmission: string;
        fuel: string;
    };
}