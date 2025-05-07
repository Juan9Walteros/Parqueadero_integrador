import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCar, FaParking } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Función de navegación absoluta garantizada
  const navigateTo = (path) => {
    // Solución definitiva para evitar rutas anidadas
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Parking</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <nav className="sections-nav">
        <button 
          className="section-btn"
          onClick={() => navigateTo('/home')}
        >
          <FaUser /> Usuarios
        </button>
        <button 
          className="section-btn"
          onClick={() => navigateTo('/vehicles')}
        >
          <FaCar /> Vehículos
        </button>
        <button 
          className="section-btn"
          onClick={() => navigateTo('/parkings')}
        >
          <FaParking /> Parkings
        </button>
      </nav>
    </div>
  );
};

export default Home;