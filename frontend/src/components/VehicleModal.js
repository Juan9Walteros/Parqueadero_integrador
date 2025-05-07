import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './VehicleModal.css';
 
const VehicleModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    plate: '',
    marca: '',
    model: '',
    color: '',
    user_id: '', // ID del usuario asociado
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const response = await axios.post('/api/vehicles', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
 
      if (response.data && response.data.vehicle) {
        onSuccess(response.data.vehicle); // Notifica al componente padre
        onClose(); // Cierra el modal
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
 
        <h2>Registrar Vehículo</h2>
 
        {error && <div className="error-message">{error}</div>}
 
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="plate">Placa</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <label htmlFor="model">Modelo</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <label htmlFor="user_id">ID Usuario</label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
            />
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
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default VehicleModal;