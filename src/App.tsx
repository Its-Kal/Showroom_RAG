import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import LoadingScreen from './LoadingScreen';

// Import pages directly
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import ChatBot from './pages/ChatBot';
import NotFoundPage from './pages/NotFoundPage';
import CarListPage from './pages/CarListPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const { isLoading } = useLoading();
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

  return (
    <Router>
      {isLoading && <LoadingScreen />}
      <div className="App">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/Chat" element={<ChatBot />} />
          <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<NotFoundPage/>} />
          <Route path="/koleksi" element={<CarListPage/>} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/koleksi/:carId" element={<CarDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;