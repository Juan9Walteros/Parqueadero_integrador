import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCar, FaParking } from 'react-icons/fa';
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
        <button className="section-btn active" onClick={() => navigate('/home')}>
          Home
        </button>
        <button className="section-btn" onClick={() => navigate('/usuarios')}>
          <FaUser /> Usuarios
        </button>
        <button className="section-btn" onClick={() => navigate('/vehiculos')}>
          <FaCar /> Vehículos
        </button>
        <button className="section-btn" onClick={() => navigate('/estacionamientos')}>
          <FaParking /> Estacionamientos
        </button>
      </nav>
 
      <main className="content-area">
        <h2>Bienvenido al Sistema de Parking</h2>
        <p>Selecciona una sección para comenzar.</p>
      </main>
    </div>
  );
};
 
export default Home;