import React, { useRef } from 'react';
import '../App.css';

interface LoadingScreenProps {
  isFadingOut: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isFadingOut }) => {
  return (
    <div className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="loading-logo">
        <span>Premium Auto</span>
        <br />
        <small>SHOWROOM</small>
      </div>
      <p className="loading-text">Memuat...</p>
    </div>
  );
};

export default LoadingScreen;