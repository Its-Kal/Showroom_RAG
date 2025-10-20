import React, { useState, useRef, useEffect } from 'react';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Saat elemen mulai terlihat, set state menjadi true
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Setelah animasi terjadi, kita tidak perlu mengamatinya lagi
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // Munculkan saat 10% elemen terlihat

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className || ''}`}>
      {children}
    </div>
  );
};

export default FadeInSection;