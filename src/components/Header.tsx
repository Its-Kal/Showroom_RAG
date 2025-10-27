import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../contexts/AuthContext'; // IMPORT useAuth

const Header: React.FC = () => {
  const { user, logout } = useAuth(); // CORRECTED: Use the real 'logout' function
  const isLoggedIn = !!user;
  const onLogout = logout; // CORRECTED: Assign the real logout function

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    onLogout();
    closeMenu();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight - 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderLoginButton = () => {
    if (isLoggedIn) {
      return <button onClick={handleLogout} className="consult-btn">Keluar</button>;
    }
    if (location.pathname === '/login') {
      return <span className="consult-btn">Haloo</span>;
    }
    return (
      <Link to="/login" className="consult-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Login Admin
      </Link>
    );
  };

  const renderMobileLoginButton = () => {
    if (isLoggedIn) {
      return <button onClick={handleLogout} className="consult-btn consult-btn-mobile">Keluar</button>;
    }
    if (location.pathname === '/login') {
      return <span className="consult-btn consult-btn-mobile">Haloo</span>;
    }
    return <Link to="/login" className="consult-btn consult-btn-mobile" onClick={closeMenu}>Login Admin</Link>;
  };

  return (
    <nav
      className={`header ${
        location.pathname !== '/' || isScrolled ? 'scrolled' : ''
      }`}
    >
      <div className="nav-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu} className="logo-link">
                <img 
        src={location.pathname !== '/' || isScrolled 
            ? "/asset/logo-hitam.png" // Path untuk logoHitam
            : "/asset/logo-putih.png" // Path untuk logoPutih
        } 
        alt="Garasix Showroom Logo" 
        className="logo-image" 
    />
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Beranda</NavLink></li>
            <li><NavLink to="/koleksi" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Koleksi</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Tentang Kami</NavLink></li>
            {isLoggedIn && <li><NavLink to="/admin/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Admin</NavLink></li>}
          </ul>
          {renderMobileLoginButton()}
        </nav>

        <div className="nav-actions">
          {renderLoginButton()}
          <button className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {/* ... toggle icons ... */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
