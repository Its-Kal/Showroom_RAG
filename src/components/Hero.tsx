import React from 'react';
import '../App.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Temukan Mobil Impian Anda</h1>
        <p>Koleksi terbaik mobil baru dan bekas dengan kualitas terjamin.</p>
        <a href="#featured" className="cta-button">Lihat Koleksi</a>
      </div>
    </section>
  );
};

export default Hero;
