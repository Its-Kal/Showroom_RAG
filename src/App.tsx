import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

// Import pages
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CarListPage from './pages/CarListPage';
import LoginPage from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';

// Layout component for public pages
const PublicLayout = () => (
  <div className="App">
    <Header />
    <main>
      <Outlet /> {/* Child routes will render here */}
    </main>
    <Footer />
  </div>
);

const AppContent = () => {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Routes>
        {/* Routes with public layout (Header/Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/koleksi" element={<CarListPage />} />
          <Route path="/koleksi/:carId" element={<CarDetailPage />} />
        </Route>

        {/* Routes without public layout */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </LoadingProvider>
  );
}

export default App;
