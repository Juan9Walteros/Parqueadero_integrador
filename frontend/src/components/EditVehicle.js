import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaPlus, FaSignOutAlt, FaUser, FaParking, FaEdit, FaTrash } from 'react-icons/fa';
import './Vehicles.css';

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // Obtiene el ID del vehículo de la URL
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    plate: '',
    marca: '',
    model: '',
    color: '',
    id_type: '',
    id_user: '',
    qr_code: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Cargar los datos del vehículo por el ID
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`/api/vehicles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setVehicle(response.data.Vehiculos);
        setFormData({
          plate: response.data.Vehiculos.plate,
          marca: response.data.Vehiculos.marca,
          model: response.data.Vehiculos.model,
          color: response.data.Vehiculos.color,
          id_type: response.data.Vehiculos.id_type,
          id_user: response.data.Vehiculos.id_user,
          qr_code: response.data.Vehiculos.qr_code
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el vehículo');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/vehicles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Vehículo actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      navigate('/vehiculos');  // Redirigir a la lista de vehículos después de la actualización
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar vehículo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="loading-message">Cargando vehículo...</div>;
  }

  return (
    <div className="vehicles-container">
      <header className="home-header">
        <h1>Editar Vehículo</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <nav className="sections-nav">
        <button className="section-btn" onClick={() => navigate('/home')}>Home</button>
        <button className="section-btn" onClick={() => navigate('/usuarios')}><FaUser /> Usuarios</button>
        <button className="section-btn" onClick={() => navigate('/vehiculos')}><FaCar /> Vehículos</button>
        <button className="section-btn" onClick={() => navigate('/estacionamientos')}><FaParking /> Estacionamientos</button>
      </nav>

      <main className="content-area">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="edit-form">
          <h2>Formulario de Edición</h2>
          <form onSubmit={handleUpdate}>
            <label>
              Placa:
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Marca:
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Modelo:
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Color:
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Tipo:
              <input
                type="text"
                name="id_type"
                value={formData.id_type}
                onChange={handleFormChange}
              />
            </label>
            <label>
              QR Code:
              <input
                type="text"
                name="qr_code"
                value={formData.qr_code}
                onChange={handleFormChange}
              />
            </label>
            <button type="submit">Actualizar</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditVehicle;
