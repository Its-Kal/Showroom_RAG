import React from 'react';
import '../App.css';

interface HeroProps {
  onButtonClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onButtonClick }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Temukan Mobil Impian Anda</h1>
        <p>Koleksi terbaik mobil baru dan bekas dengan kualitas terjamin.</p>
        <button onClick={onButtonClick} className="cta-button">Lihat Koleksi</button>
      </div>
    </section>
  );
};

export default Hero;
