import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import LoadingScreen from './LoadingScreen';

// Import pages directly
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CarListPage from './pages/CarListPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const { isLoading } = useLoading();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // Sembunyikan Header dan Footer di halaman login dan admin
  const showHeaderFooter = !['/login', '/admin'].includes(location.pathname);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Routes>
        {/* Rute tanpa Header/Footer */}
        <Route path="/admin" element={isLoggedIn ? <AdminDashboard onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Rute untuk halaman publik dengan layout Header/Footer */}
        <Route path="/*" element={
          <div className="App">
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/koleksi" element={<CarListPage/>} />
              <Route path="/koleksi/:carId" element={<CarDetailPage />} />
              <Route path="*" element={<NotFoundPage/>} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}

export default App;