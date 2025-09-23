import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage'; // Impor halaman baru
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Rute untuk Halaman Utama */}
          <Route path="/" element={<HomePage />} />

          {/* Rute untuk Halaman Tentang Kami */}
          <Route path="/about" element={<AboutPage />} />

          {/* TEMPAT MENAMBAHKAN RUTE BARU */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

            {/* Tambahkan route ini */}
            <Route path="/cars/:carId" element={<CarDetailPage />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;