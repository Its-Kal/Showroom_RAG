import React from 'react';
import '../App.css';

const cars = [
  {
    name: 'SUV Modern',
    description: 'Kenyamanan dan gaya bertemu dalam SUV canggih ini.',
    price: 'Rp 450.000.000',
    image: 'https://via.placeholder.com/300x200.png?text=SUV+Modern'
  },
  {
    name: 'Sedan Elegan',
    description: 'Performa tinggi dan desain mewah untuk pengalaman berkendara terbaik.',
    price: 'Rp 600.000.000',
    image: 'https://via.placeholder.com/300x200.png?text=Sedan+Elegan'
  },
  {
    name: 'City Car Gesit',
    description: 'Solusi mobilitas perkotaan yang efisien dan handal.',
    price: 'Rp 250.000.000',
    image: 'https://via.placeholder.com/300x200.png?text=City+Car+Gesit'
  }
];

const FeaturedCars = React.forwardRef<HTMLElement>((props, ref) => {
  return (
    <section id="featured" className="featured-cars" ref={ref}>
      <h2>Mobil Unggulan Kami</h2>
      <div className="car-list">
        {cars.map((car, index) => (
          <div key={index} className="car-card">
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p>{car.description}</p>
            <p className="price">{car.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default FeaturedCars;
