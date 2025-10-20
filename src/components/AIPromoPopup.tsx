import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Kita akan menambahkan style di sini

interface AIPromoPopupProps {
  onClose: () => void;
  onStartConsultation: () => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AIPromoPopup: React.FC<AIPromoPopupProps> = ({ onClose, onStartConsultation }) => {
  return (
    <div className="promo-popup-container">
      <button onClick={onClose} className="promo-popup-close" aria-label="Tutup promosi">
        <CloseIcon />
      </button>
      
      <div className="promo-popup-content">
        <h3>Bingung Pilih Mobil?</h3>
        <p>
          Biarkan <strong>AI Consultant</strong> kami membantu Anda. Temukan mobil impian 
          berdasarkan preferensi Anda secara instan.
        </p>
      </div>

      <div className="promo-popup-actions">
        <button 
          onClick={onStartConsultation} 
          className="promo-btn primary"
        >
          Mulai Konsultasi AI
        </button>
        <Link to="/koleksi" onClick={onClose} className="promo-btn secondary">
          Lihat Semua Stok
        </Link>
      </div>
    </div>
  );
};

export default AIPromoPopup;