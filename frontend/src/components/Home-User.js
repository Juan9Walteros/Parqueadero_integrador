import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaCar, FaEdit, FaTrash } from 'react-icons/fa';
import './Home.css';

const UserHome = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // El backend ya filtra los vehículos del usuario
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

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserVehicles(); // Recargar la lista
    } catch (err) {
      console.error('Error al eliminar vehículo:', err);
      setError('No se pudo eliminar el vehículo');
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
            <h2>Mis Vehículos Registrados</h2>
            <button
              onClick={() => navigate('/vehicles/create')}
              className="add-vehicle-btn"
            >
              <FaPlus /> Nuevo Vehículo
            </button>
          </div>

          {loading ? (
            <div className="loading">Cargando...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <p>No tienes vehículos registrados</p>
              <button 
                onClick={() => navigate('/vehicles/create')}
                className="primary-btn"
              >
                <FaPlus /> Registrar mi primer vehículo
              </button>
            </div>
          ) : (
            <div className="table-responsive">
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
                      <td className="actions">
                        <button 
                          onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                          className="edit-btn"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
                          className="delete-btn"
                        >
                          <FaTrash />
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