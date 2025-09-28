import React, { useRef } from 'react';
import Hero from '../components/Hero';
import CollectionSection from '../components/CollectionSection';
import TestimonialSection from '../components/TestimonialSection';  

const HomePage: React.FC = () => {
  const featuredRef = useRef<HTMLDivElement>(null);

  const handleScrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Hero onButtonClick={handleScrollToFeatured} />
      <CollectionSection />
      <TestimonialSection />
    </main>
  );
};

export default HomePage;