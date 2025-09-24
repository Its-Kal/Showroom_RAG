export type CarStatus = 'available' | 'reserved';

export interface Car {
  id: number;
  name: string;
  year: string;
  price: string; // atau number jika nanti dari backend dalam bentuk angka
  image: string;
  category: string;
  status: CarStatus;
  acceleration: string;
  fuelConsumption: string;
}