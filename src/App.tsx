import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import './App.css';
import ChatBot from './pages/ChatBot';
import NotFoundPage from "./pages/NotFoundPage";
import CarListPage from './pages/CarListPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
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

export default App;