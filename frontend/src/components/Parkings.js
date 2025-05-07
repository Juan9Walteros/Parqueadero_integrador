import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaParking, FaCar, FaSignOutAlt, FaUser, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import './Parkings.css';

const Parkings = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener los datos
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [parkingsRes, vehiclesRes] = await Promise.all([
        axios.get('/api/parkings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/vehicles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setParkings(parkingsRes.data.Estacionamientos || parkingsRes.data.parkings || []);
      setVehicles(vehiclesRes.data.Vehiculos || vehiclesRes.data.vehicles || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener placa del vehículo
  const getVehiclePlate = (vehicleId) => {
    if (!vehicleId) return 'N/A';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : 'N/A';
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar estacionamientos
  const filteredParkings = parkings.filter(parking => {
    const plate = getVehiclePlate(parking.id_vehicle).toLowerCase();
    return plate.includes(searchTerm.toLowerCase()) || 
           parking.id.toString().includes(searchTerm);
  });

  return (
    <div className="parkings-container">
      <header className="home-header">
        <h1><FaParking /> Gestión de Estacionamientos</h1>
        <button onClick={() => navigate('/')} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <nav className="sections-nav">
        <button className="section-btn" onClick={() => navigate('/home')}>
          Home
        </button>
        <button className="section-btn" onClick={() => navigate('/usuarios')}>
          <FaUser /> Usuarios
        </button>
        <button className="section-btn" onClick={() => navigate('/vehiculos')}>
          <FaCar /> Vehículos
        </button>
        <button className="section-btn active">
          <FaParking /> Estacionamientos
        </button>
      </nav>

      <main className="content-area">
        {error && <div className="error-message">{error}</div>}

        <div className="search-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por placa o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID Estacionamiento</th>
                <th>Placa del Vehículo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="loading-message">Cargando datos...</td>
                </tr>
              ) : filteredParkings.length > 0 ? (
                filteredParkings.map((parking, index) => (
                  <tr key={parking.id || index}>
                    <td>{index + 1}</td>
                    <td>{parking.id}</td>
                    <td>{getVehiclePlate(parking.id_vehicle)}</td>
                    <td>
                      {parking.availability === 1 ? (
                        <span className="status-badge available">
                          <FaCheck /> Disponible
                        </span>
                      ) : (
                        <span className="status-badge occupied">
                          <FaTimes /> Ocupado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    {parkings.length === 0 ? 'No hay estacionamientos registrados' : 'No se encontraron resultados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Parkings;