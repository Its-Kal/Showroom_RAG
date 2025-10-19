export type CarStatus = 'new' | 'used';
export type CarCategory = 'luxury' | 'SUV' | 'electric' | 'sport' | string;

// This type should now match the `CarRead` model from the backend
export interface Car {
    id: number;
    name: string;
    year: number;
    price: number;
    image: string; // Main thumbnail image
    description: string;
    category: CarCategory;
    status: CarStatus;
    acceleration: string;
    fuelConsumption: string;
    images: string[]; // Gallery images
    specifications: { [key: string]: any }; // Flexible specifications object
}

// This can be removed or kept depending on whether you need a separate detailed view model
export interface CarDetailData extends Car {
    // All properties are now in the base Car interface
}