import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCar, FaParking } from 'react-icons/fa';
import './Home.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const vehicleResponse = await axios.get(`/api/vehicles/user/${userResponse.data.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setUser(userResponse.data);
        setVehicle(vehicleResponse.data || null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar tu información');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Mi Perfil</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <nav className="sections-nav">
        <button className="section-btn" onClick={() => navigate('/userhome')}>
          Home
        </button>
        <button className="section-btn active" onClick={() => navigate('/userprofile')}>
          <FaUser /> Mi Perfil
        </button>
        <button className="section-btn" onClick={() => navigate('/uservehicles')}>
          <FaCar /> Mis Vehículos
        </button>
        <button className="section-btn" onClick={() => navigate('/userparking')}>
          <FaParking /> Estacionamientos
        </button>
      </nav>

      <main className="content-area">
        {loading ? (
          <div className="loading-message">Cargando información...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="profile-content">
            <section className="user-info">
              <h2>Información del Usuario</h2>
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Apellido:</strong> {user.apellido}</p>
              <p><strong>Carrera:</strong> {user.carrera}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </section>

            <section className="vehicle-info">
              <h2>Información del Vehículo</h2>
              {vehicle ? (
                <>
                  <p><strong>Placa:</strong> {vehicle.plate}</p>
                  <p><strong>Tipo:</strong> {vehicle.tipo_vehiculo}</p>
                  <p><strong>Marca:</strong> {vehicle.marca}</p>
                  <p><strong>Modelo:</strong> {vehicle.modelo}</p>
                </>
              ) : (
                <p>No tienes un vehículo registrado.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
