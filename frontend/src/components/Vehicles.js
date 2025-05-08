import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaPlus, FaSignOutAlt, FaUser, FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import './Vehicles.css';

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    plate: '',
    marca: '',
    model: '',
    color: '',
    id_type: ''
  });

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/vehicles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.Vehiculos) {
        setVehicles(response.data.Vehiculos);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.response?.data?.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingId(vehicle.id);
    setEditFormData({
      plate: vehicle.plate,
      marca: vehicle.marca,
      model: vehicle.model,
      color: vehicle.color,
      id_type: vehicle.id_type
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`/api/vehicles/${editingId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.message === 'Vehiculo actualizado correctamente') {
        setSuccess('Vehículo actualizado correctamente');
        setEditingId(null);
        fetchVehicles(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar vehículo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

    try {
      await axios.delete(`/api/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Vehículo eliminado correctamente');
      fetchVehicles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar vehículo');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="vehicles-container">
      <header className="home-header">
        <h1>Gestión de Vehículos</h1>
        <button onClick={handleLogout} className="logout-btn">
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
        <button className="section-btn active">
          <FaCar /> Vehículos
        </button>
      </nav>

      <main className="content-area">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="vehicles-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="add-vehicle-btn"
            onClick={() => navigate('/vehicles/create')}
          >
            <FaPlus /> Registrar Vehículo
          </button>
        </div>

        <div className="vehicles-table-container">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Tipo</th>
                <th>Usuario</th>
                <th>QR</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-message">Cargando vehículos...</td>
                </tr>
              ) : filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    {editingId === vehicle.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="plate"
                            value={editFormData.plate}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="marca"
                            value={editFormData.marca}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="model"
                            value={editFormData.model}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="color"
                            value={editFormData.color}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="id_type"
                            value={editFormData.id_type}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="id_user"
                            value={editFormData.id_user}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="qr_code"
                            value={editFormData.qr_code}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <button
                            className="save-btn"
                            onClick={handleSaveClick}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={handleCancelClick}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{vehicle.plate}</td>
                        <td>{vehicle.marca}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.color}</td>
                        <td>{vehicle.id_type}</td>
                        <td>{vehicle.id_user}</td>
                        <td>{vehicle.qr_code}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditClick(vehicle)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(vehicle.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    {vehicles.length === 0 ? 'No hay vehículos registrados' : 'No se encontraron resultados'}
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

export default Vehicles;
 