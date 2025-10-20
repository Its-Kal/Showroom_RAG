import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

interface HeroProps {
  onButtonClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onButtonClick }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-buttons">
        </div>
      </div>
    </section>
  );
};

export default Hero;