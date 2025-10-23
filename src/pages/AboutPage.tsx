import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AboutPage.css';

// Placeholder icons for values section
const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="value-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="value-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const TrustIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="value-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="toggle-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const AboutPage: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Cleanup observer on component unmount
    return () => {
      elementsToAnimate.forEach(el => observer.unobserve(el));
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const values = [
    {
      icon: <QualityIcon />,
      title: "Kualitas Tanpa Kompromi",
      description: "Setiap mobil dalam koleksi kami telah melalui proses inspeksi ketat untuk memastikan standar kualitas, performa, dan keamanan tertinggi."
    },
    {
      icon: <ServiceIcon />,
      title: "Layanan Personal",
      description: "Tim konsultan kami siap membantu Anda menemukan mobil yang paling sesuai dengan gaya hidup dan kebutuhan Anda."
    },
    {
      icon: <TrustIcon />,
      title: "Integritas & Transparansi",
      description: "Kami percaya pada hubungan jangka panjang. Semua proses, dari harga hingga riwayat kendaraan, kami sajikan secara terbuka dan jujur."
    }
  ];

  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="about-hero-content">
          <h1>Tentang Garasix Showroom</h1>
          <p>Lebih dari sekadar menjual mobil, kami mewujudkan impian.</p>
        </div>
      </header>

      <main className="about-content">
        <section className="about-section vision-mission animate-on-scroll">
          <div className="vision-mission-text">
            <h2>Visi & Misi Kami</h2>
            <p className="quote-paragraph">
              Menjadi showroom mobil terpercaya di Indonesia yang dikenal karena koleksi premium, layanan pelanggan yang luar biasa, dan integritas bisnis yang tak tergoyahkan.
            </p>
            <p className="quote-paragraph">
              Kami berkomitmen untuk memberikan pengalaman membeli mobil yang mudah, transparan, dan memuaskan bagi setiap pelanggan.
            </p>
          </div>
        </section>

        <section className="about-section values-section animate-on-scroll">
          <h2>Nilai-Nilai Kami</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div
                key={index}
                className={`value-card ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="value-card-header">
                  {value.icon}
                  <h3>{value.title}</h3>
                  <PlusIcon />
                </div>
                <div className="value-card-body"><p>{value.description}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section cta-section">
          <h2>Siap Menemukan Mobil Impian Anda?</h2>
          <p>Jelajahi koleksi mobil premium kami dan temukan yang paling cocok untuk Anda.</p>
          <NavLink to="/koleksi" className="btn-cta">Lihat Koleksi Mobil</NavLink>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
