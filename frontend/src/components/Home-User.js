import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaCar } from 'react-icons/fa';
import './Home.css';

const UserHome = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Cambiar la URL para obtener solo vehículos del usuario
      const response = await axios.get(`/api/vehicles/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      console.error('Error al cargar vehículos:', err);
      setError(err.response?.data?.message || 'Error al cargar tus vehículos');
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVehicles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1><FaCar /> Mis Vehículos</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <main className="content-area">
        <section className="vehicles-section">
          <div className="section-header">
            <h2>Listado de Vehículos</h2>
            <button
              onClick={() => navigate('/crear-vehiculo')}
              className="add-vehicle-btn"
            >
              <FaPlus /> Agregar Vehículo
            </button>
          </div>

          {loading ? (
            <p>Cargando vehículos...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : vehicles.length === 0 ? (
            <div className="no-vehicles">
              <p>No tienes vehículos registrados.</p>
              <button 
                onClick={() => navigate('/crear-vehiculo')}
                className="primary-btn"
              >
                <FaPlus /> Registrar mi primer vehículo
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="vehicles-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Color</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.plate}</td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.color}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/vehiculos/${vehicle.id}`)}
                          className="action-btn"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserHome;