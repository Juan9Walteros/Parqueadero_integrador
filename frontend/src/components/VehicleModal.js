import React, { useState, useEffect } from 'react'; // Añade useEffect aquí
import axios from 'axios';
import { FaTimes, FaCar, FaPalette, FaIdCardAlt } from 'react-icons/fa';
import './VehicleModal.css';

// Resto del código permanece igual...

// Resto del código permanece igual...

const VehicleModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    plate: '',
    marca: '',
    model: '',
    color: '',
    id_type: 1 // Valor por defecto
  });
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('/api/vehicle-types');
        setTypes(response.data.types || []);
      } catch (err) {
        console.error('Error al cargar tipos de vehículo:', err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/vehicles', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.vehicle) {
        onSuccess(response.data.vehicle);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>Registrar Nuevo Vehículo</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaIdCardAlt className="input-icon" />
            <input
              type="text"
              name="plate"
              placeholder="Placa del vehículo"
              value={formData.plate}
              onChange={handleChange}
              required
              maxLength="10"
            />
          </div>

          <div className="input-group">
            <FaCar className="input-icon" />
            <input
              type="text"
              name="marca"
              placeholder="Marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaCar className="input-icon" />
            <input
              type="text"
              name="model"
              placeholder="Modelo"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPalette className="input-icon" />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaCar className="input-icon" />
            <select
              name="id_type"
              value={formData.id_type}
              onChange={handleChange}
              required
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;