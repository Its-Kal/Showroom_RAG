import React from 'react';
import { Testimonial } from '../types/Testimonial'; // ✅ Impor interface

// Data dummy
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'CEO',
    company: 'PT Maju Jaya',
    // Menggunakan UI Avatars untuk placeholder yang lebih baik
    image: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0D8ABC&color=fff&size=96',
    rating: 5,
    message: 'Pelayanan luar biasa! Mobil yang saya beli sesuai deskripsi dan kondisi prima.'
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    role: 'Marketing Director',
    company: 'CV Karya Indah',
    image: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=1a237e&color=fff&size=96',
    rating: 5,
    message: 'Proses pembelian sangat cepat dan transparan. Sangat direkomendasikan!'
  },
  {
    id: 3,
    name: 'Andi Wijaya',
    role: 'Founder',
    company: 'StartupXYZ',
    image: 'https://ui-avatars.com/api/?name=Andi+Wijaya&background=4a5568&color=fff&size=96',
    rating: 4,
    message: 'Mobilnya keren, harga kompetitif. Hanya sedikit kendala administrasi, tapi tim langsung membantu.'
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="testimonial-section">
      <div className="testimonial-section-header">
        <h2>Apa Kata Pelanggan Kami?</h2>
        <p>Pengalaman mereka adalah bukti komitmen kami terhadap kualitas dan kepuasan.</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <p className="testimonial-message">"{testimonial.message}"</p>
            <div className="testimonial-author">
              <img className="author-image" src={testimonial.image} alt={testimonial.name} />
              <div className="author-info">
                <span className="author-name">{testimonial.name}</span>
                <span className="author-role">{testimonial.role}{testimonial.company && `, ${testimonial.company}`}</span>
              </div>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;