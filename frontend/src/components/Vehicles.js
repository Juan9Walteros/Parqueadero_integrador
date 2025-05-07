import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaPlus, 
  FaSearch, 
  FaQrcode, 
  FaTrash, 
  FaSignOutAlt, 
  FaUser,
  FaParking // Añadido aquí
} from 'react-icons/fa';
import VehicleModal from './VehicleModal';
import './Vehicles.css';

// Resto del código permanece igual...

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/vehicles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleVehicleCreated = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
    setShowCreateModal(false);
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
        <button className="section-btn" onClick={() => navigate('/home/usuarios')}>
          <FaUser /> Usuarios
        </button>
        <button className="section-btn active">
          <FaCar /> Vehículos
        </button>
        <button className="section-btn" onClick={() => navigate('/home/parkings')}>
          <FaParking /> Parkings
        </button>
      </nav>

      <main className="content-area">
        <div className="vehicles-content">
          <h2><FaCar /> Mis Vehículos</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="controls">
            <button 
              className="add-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> Registrar Vehículo
            </button>
          </div>

          <div className="vehicles-grid">
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-info">
                    <h3>{vehicle.marca} {vehicle.model}</h3>
                    <p><strong>Placa:</strong> {vehicle.plate}</p>
                    <p><strong>Color:</strong> {vehicle.color}</p>
                    <p><strong>Tipo:</strong> {vehicle.type_name}</p>
                  </div>
                  <div className="qr-container">
                    {vehicle.qr_code && (
                      <img 
                        src={`data:image/png;base64,${vehicle.qr_code}`} 
                        alt="Código QR del vehículo"
                        className="qr-image"
                      />
                    )}
                    <button className="qr-btn">
                      <FaQrcode /> Ver QR
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-vehicles">
                {loading ? 'Cargando...' : 'No tienes vehículos registrados'}
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <VehicleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleVehicleCreated}
        />
      )}
    </div>
  );
};

export default Vehicles;