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
        <h1>Premium Auto<br />Showroom</h1>
        <p>Temukan mobil impian Anda dari koleksi kendaraan mewah pilihan terbaik dunia</p>
        <div className="hero-buttons">
          <Link to="/koleksi" className="btn-primary" onClick={onButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Jelajahi Koleksi
          </Link>
          <Link to="/Chat" className="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Konsultasi AI
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;