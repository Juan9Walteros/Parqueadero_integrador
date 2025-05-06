import React, { useState } from 'react';
import { FaSignOutAlt, FaUser, FaCar, FaParking } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [activeSection, setActiveSection] = useState('usuarios');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>Sistema de Parking</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      {/* Navegación */}
      <nav className="sections-nav">
        <button 
          className={`section-btn ${activeSection === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveSection('usuarios')}
        >
          <FaUser /> Usuarios
        </button>
        <button 
          className={`section-btn ${activeSection === 'vehiculos' ? 'active' : ''}`}
          onClick={() => setActiveSection('vehiculos')}
        >
          <FaCar /> Vehículos
        </button>
        <button 
          className={`section-btn ${activeSection === 'parkings' ? 'active' : ''}`}
          onClick={() => setActiveSection('parkings')}
        >
          <FaParking /> Parkings
        </button>
      </nav>

      {/* Contenido dinámico */}
      <main className="content-area">
        {activeSection === 'usuarios' && <div className="usuarios-content"></div>}
        {activeSection === 'vehiculos' && <div className="vehiculos-content"></div>}
        {activeSection === 'parkings' && <div className="parkings-content"></div>}
      </main>
    </div>
  );
};

export default Home;