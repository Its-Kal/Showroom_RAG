import React, { useRef } from 'react';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import About from '../components/About';

const HomePage: React.FC = () => {
  const featuredRef = useRef<HTMLElement>(null);

  const handleScrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Hero onButtonClick={handleScrollToFeatured} />
      <FeaturedCars ref={featuredRef} />
      <About />
    </main>
  );
};

export default HomePage;
