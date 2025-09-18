import React from 'react';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import About from '../components/About';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <FeaturedCars />
      <About />
    </main>
  );
};

export default HomePage;
