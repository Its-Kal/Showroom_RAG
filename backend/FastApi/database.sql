CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    name TEXT,
    year TEXT,
    price TEXT,
    image TEXT,
    category TEXT,
    status TEXT,
    acceleration TEXT,
    fuelConsumption TEXT,
    description TEXT,
    images TEXT[],
    specifications JSONB
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
