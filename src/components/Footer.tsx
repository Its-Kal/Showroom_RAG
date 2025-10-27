import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="company-info">
          <div className="logo-footer">
            <img src="/asset/logo-putih.png" alt="Logo Perusahaan Putih" />
          </div>
          <p>
            Showroom mobil premium terpercaya dengan koleksi kendaraan mewah dari brand-brand terkemuka dunia.<br />
            Dipercaya lebih dari 10,000 pelanggan.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 17.46 17.46 0 0 0-13-5.46A17.46 17.46 0 0 0 2 19a2 2 0 0 1-2-2V7.08a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9.84z"></path>
                <path d="M16 3.08v1.72a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V3.08"></path>
                <path d="M12 15l-2-2 2-2"></path>
                <path d="M12 15l2-2-2-2"></path>
              </svg>
              <span>+62 21 1234 5678</span>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>info@garasix.com</span>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-19.33-7.66"></path>
                <polyline points="22 4 12 14.01 2 4"></polyline>
              </svg>
              <span>Jl. Sudirman No. 123<br />Jakarta Pusat, 10220</span>
            </div>
          </div>
        </div>

        <div className="footer-columns" style={{ display: 'flex', gap: '40px' }}>
          <div className="column">
            <h4>Perusahaan</h4>
            <ul>
              <li><Link to="/about">Tentang Kami</Link></li>
            </ul>
          </div>
          <div className="column">
            <h4>Layanan</h4>
            <ul>
              <li><Link to="/koleksi">Koleksi Mobil</Link></li>
              <li><Link to="/chatbot">Konsultasi AI</Link></li>
            </ul>
          </div>
          <div className="column">
            <h4>Sosial Media</h4>
            <div className="social-links" style={{ marginTop: '10px' }}>
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 0-1-1z"></path></svg></a>
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2zm4-8h-2v6h2zm0 8h-2v2h2z"></path></svg></a>
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 18.33l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Garasix Showroom. All rights reserved.</p>
      </div>
      
    </footer>
  );
};

export default Footer;