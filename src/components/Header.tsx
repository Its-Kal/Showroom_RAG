import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <span>Premium Auto</span>
          <br />
          <small>SHOWROOM</small>
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Beranda</Link></li>
          <li><Link to="/koleksi">Koleksi</Link></li>
          <li><Link to="/testimoni">Testimoni</Link></li>
        </ul>
      </nav>
      <button className="consult-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Konsultasi
      </button>
    </header>
  );
};

export default Header;