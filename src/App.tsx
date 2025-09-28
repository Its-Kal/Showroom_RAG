import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage'; // Impor halaman baru
import './App.css';
import ChatBot from './pages/ChatBot';
import NotFoundPage from "./pages/NotFoundPage";
import CarListPage from './pages/CarListPage';

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

          {/* Rute untuk Halaman ChatBot */}
          <Route path="/Chat" element={<ChatBot />} />

          {/* Rute untuk Halaman ChatBot */}
          <Route path="*" element={<NotFoundPage/>} />
            <Route path="/koleksi" element={<CarListPage/>} />
          {/* TEMPAT MENAMBAHKAN RUTE BARU */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

            {/* Tambahkan route ini */}
            <Route path="/koleksi/:carId" element={<CarDetailPage />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;