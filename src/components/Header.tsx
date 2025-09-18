import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Showroom Mobil Impian
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">Tentang Kami</Link></li>
          {/* Jika Anda membuat halaman login, uncomment baris di bawah */}
          {/* <li><Link to="/login">Login</Link></li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;