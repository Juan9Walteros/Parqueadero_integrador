import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaParking, 
  FaCar, 
  FaTimes, 
  FaCheck, 
  FaSearch, 
  FaSignOutAlt,
  FaUser  // Icono añadido aquí
} from 'react-icons/fa';
import './Parkings.css';

const Parkings = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchParkings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/parkings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setParkings(response.data.Estacionamientos || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar estacionamientos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const filteredParkings = parkings.filter(parking =>
    parking.id.toString().includes(searchTerm.toLowerCase()) ||
    (parking.id_vehicle && parking.id_vehicle.toString().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Parking</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <nav className="sections-nav">
        <button className="section-btn" onClick={() => navigate('/home/usuarios')}>
          <FaUser /> Usuarios
        </button>
        <button className="section-btn" onClick={() => navigate('/home/vehiculos')}>
          <FaCar /> Vehículos
        </button>
        <button className="section-btn active">
          <FaParking /> Parkings
        </button>
      </nav>

      <main className="content-area">
        <div className="parkings-content">
          <h2><FaParking /> Gestión de Estacionamientos</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="search-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar estacionamientos..."
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
                  <th>ID</th>
                  <th>Vehículo ID</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredParkings.length > 0 ? (
                  filteredParkings.map((parking, index) => (
                    <tr key={parking.id} className={parking.availability ? 'available' : 'occupied'}>
                      <td>{index + 1}</td>
                      <td>{parking.id}</td>
                      <td>{parking.id_vehicle || 'N/A'}</td>
                      <td>
                        {parking.availability ? (
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
                      {loading ? 'Cargando...' : 'No se encontraron estacionamientos'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parkings;