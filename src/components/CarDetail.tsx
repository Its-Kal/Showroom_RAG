// Di dalam src/components/CarDetail.tsx
import React from 'react';
import { CarDetailData } from '../types/Car';

const ContactIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ marginRight: 8 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75zm0 0l9.75 6.75 9.75-6.75" />
  </svg>
);

const CarDetail: React.FC<{ car: CarDetailData }> = ({ car }) => {
  return (
    <div className="collection-card-content car-detail-card" style={{
      maxWidth: '900px',
      margin: '2rem auto',
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      padding: '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      alignItems: 'center',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    }}>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.7rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b', letterSpacing: '-1px' }}>{car.name}</h1>
        <span className="category-badge" style={{ fontSize: '1.05rem', background: '#e0e7ef', color: '#2563eb', borderRadius: '1rem', padding: '0.3rem 1.2rem', marginBottom: '1rem', display: 'inline-block', fontWeight: 600 }}>{car.category}</span>
      </div>
      <div className="car-images" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img src={car.images[0]} alt={car.name} style={{ maxWidth: '100%', maxHeight: 420, borderRadius: '1.2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '2.1rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.5px' }}>Rp {car.price.toLocaleString('id-ID')}</h2>
        <div style={{ width: '100%', background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: '#2563eb' }}>Deskripsi</h3>
          <p style={{ color: '#334155', fontSize: '1.13rem', lineHeight: 1.7 }}>{car.description}</p>
        </div>
        <div style={{ width: '100%', background: '#e0e7ef', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: '#2563eb' }}>Spesifikasi Utama</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {Object.entries(car.specifications).map(([key, value]) => (
              <li key={key} style={{ minWidth: 120, color: '#1e293b', fontSize: '1.08rem', fontWeight: 500 }}>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="button-bg contact-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '1.13rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '2rem',
            padding: '0.7rem 2.2rem',
            marginTop: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.13)',
            background: 'var(--button-bg, #2563eb)',
            color: '#fff',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ContactIcon /> Hubungi Kami
        </button>
      </div>
    </div>
  );
};

export default CarDetail;