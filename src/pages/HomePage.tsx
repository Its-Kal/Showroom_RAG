import React, { useRef, useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CollectionSection from '../components/CollectionSection';
import TestimonialSection from '../components/TestimonialSection';
import ChatBot from './ChatBot'; // Import ChatBot
import AIPromoPopup from '../components/AIPromoPopup'; // Import komponen popup promo
import FadeInSection from '../components/FadeInSection'; // Import komponen animasi

// Ikon untuk floating chat button
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="32" height="32">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const HomePage: React.FC = () => {
  const featuredRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const handleScrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Tampilkan popup setelah jeda singkat setiap kali halaman dimuat
    const timer = setTimeout(() => {
      setIsPromoOpen(true);
    }, 1500); // Tunda 1.5 detik

    // Bersihkan timer saat komponen unmount
    return () => clearTimeout(timer);
  }, []);

  const handleStartConsultation = () => {
    setIsPromoOpen(false); // Tutup promo
    setIsChatOpen(true);   // Buka chat
  };

  return (
    <main>
      <Hero onButtonClick={handleScrollToFeatured} />
      <FadeInSection>
        <CollectionSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialSection />
      </FadeInSection>
      {isPromoOpen && <AIPromoPopup onClose={() => setIsPromoOpen(false)} onStartConsultation={handleStartConsultation} />}

      {/* Floating Action Button untuk Chat */}
      <button className="chat-fab" onClick={() => setIsChatOpen(true)} aria-label="Open AI Consultant">
        <ChatIcon />
      </button>

      {/* Komponen ChatBot sebagai Popup */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
};

export default HomePage;