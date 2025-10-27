import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext'; // V3 IMPORT
import LoadingScreen from './LoadingScreen';

// Import pages
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CarListPage from './pages/CarListPage';
import LoginPage from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage'; // V3 IMPORT

const AppContent = () => {
  const { isLoading } = useLoading();
  const location = useLocation();

  // Sembunyikan Header dan Footer di halaman login dan admin
  const showHeaderFooter = !['/login', '/admin/dashboard'].includes(location.pathname);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Routes>
        {/* V3 Route: /admin/dashboard now renders DashboardPage, protected internally */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rute untuk halaman publik dengan layout Header/Footer */}
        <Route path="/*" element={
          <div className="App">
            {/* Header no longer needs login management props */}
            <Header />
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
        {/* V3: AuthProvider wraps the app content */}
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </LoadingProvider>
  );
}

export default App;