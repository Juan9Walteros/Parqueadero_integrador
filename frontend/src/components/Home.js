import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCar, FaParking } from 'react-icons/fa';
import Usuarios from './Users';
import Vehiculos from './Vehicles'; // Componente similar para vehículos
import Parkings from './Parkings';   // Componente similar para parkings
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
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
          onClick={() => navigate('/home')}
        >
          <FaUser /> Usuarios
        </button>
        <button 
          className="section-btn"
          onClick={() => navigate('/home/vehiculos')}
        >
          <FaCar /> Vehículos
        </button>
        <button 
          className="section-btn"
          onClick={() => navigate('/home/parkings')}
        >
          <FaParking /> Parkings
        </button>
      </nav>

      <main className="content-area">
        <Routes>
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="parkings" element={<Parkings />} />
          {/* Ruta por defecto */}
          <Route path="*" element={<Usuarios />} />
        </Routes>
      </main>
    </div>
  );
};

export default Home;