import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCar, FaSearch, FaClock, FaArrowRight, FaArrowLeft, FaTrash, FaBarcode } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [accessRecords, setAccessRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCode, setQrCode] = useState(''); // Nueva variable de estado para almacenar el código QR

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [recordsResponse, vehiclesResponse] = await Promise.all([
        axios.get('/api/accessrecords', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/vehicles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setAccessRecords(recordsResponse.data.Registros || []);
      setVehicles(vehiclesResponse.data.Vehiculos || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.response?.data?.message || 'Error al cargar registros de acceso');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de acceso?')) return;

    try {
      await axios.delete(`/api/accessrecords/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setSuccess('Registro de acceso eliminado correctamente');
      fetchData(); // Recargar los datos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al eliminar registro:', err);
      setError(err.response?.data?.message || 'Error al eliminar registro de acceso');
    }
  };

  const getVehiclePlate = (vehicleId) => {
    if (!vehicleId) return 'N/A';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : 'N/A';
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const getAccessType = (record) => {
    return record.entry_time && !record.exit_time ? 'Entrada' : 
           record.exit_time ? 'Salida' : 'Registro';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRecords = accessRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const plate = getVehiclePlate(record.id_vehicle).toLowerCase();
    return (
      plate.includes(searchLower) ||
      formatDateTime(record.entry_time).toLowerCase().includes(searchLower) ||
      formatDateTime(record.exit_time).toLowerCase().includes(searchLower)
    );
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Función para llamar a la API con el código QR
  const handleScanQRCode = async () => {
    if (!qrCode) {
      setError('Por favor, ingresa un código QR válido');
      return;
    }

    try {
      const response = await axios.post(`/api/accessrecords/scan/${qrCode}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Código QR escaneado correctamente');
      fetchData(); // Recargar los datos
      setQrCode(''); // Limpiar el campo de texto después de escanear el código QR
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al escanear código QR:', err);
      setError(err.response?.data?.message || 'Error al escanear código QR');
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
        <button className="section-btn active" onClick={() => navigate('/home')}>
          Home
        </button>
        <button className="section-btn" onClick={() => navigate('/usuarios')}>
          <FaUser /> Usuarios
        </button>
        <button className="section-btn" onClick={() => navigate('/vehiculos')}>
          <FaCar /> Vehículos
        </button>
      </nav>

      <main className="content-area">
        <div className="welcome-section">
          <h2>Registros de Acceso al Estacionamiento</h2>
          <p>Historial de entradas y salidas de vehículos</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="search-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por placa o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Botón para escanear QR */}
        <div className="scan-qr-btn-container">
          <input
            type="text"
            placeholder="Escanear código QR"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
          <button className="scan-qr-btn" onClick={handleScanQRCode}>
            <FaBarcode /> Escanear QR
          </button>
        </div>

        <div className="records-container">
          {loading ? (
            <div className="loading-message">Cargando registros de acceso...</div>
          ) : filteredRecords.length > 0 ? (
            <table className="records-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehículo</th>
                  <th>Tipo</th>
                  <th>Hora de Entrada</th>
                  <th>Hora de Salida</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={record.id || index}>
                    <td>{index + 1}</td>
                    <td>{getVehiclePlate(record.id_vehicle)}</td>
                    <td className={`access-type ${getAccessType(record).toLowerCase()}`}>
                      {getAccessType(record) === 'Entrada' ? (
                        <FaArrowRight className="access-icon" />
                      ) : (
                        <FaArrowLeft className="access-icon" />
                      )}
                      {getAccessType(record)}
                    </td>
                    <td>{formatDateTime(record.entry_time)}</td>
                    <td>{formatDateTime(record.exit_time) || 'En estacionamiento'}</td>
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteRecord(record.id)}
                        title="Eliminar registro"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              {accessRecords.length === 0 ? 'No hay registros de acceso' : 'No se encontraron resultados'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
