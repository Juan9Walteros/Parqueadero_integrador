import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaUser, FaLock, FaPhone, FaIdCard } from 'react-icons/fa';
import './UserModal.css';
 
const UserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    id_rol: 2, // Valor por defecto: Usuario Normal
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Validación de contraseñas
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }
 
    setLoading(true);
    setError('');
 
    try {
      const response = await axios.post('/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
 
      if (response.data && response.data.user) {
        onSuccess(response.data.user); // Notifica al componente padre
        onClose(); // Cierra el modal
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
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
 
        <h2>Crear Nuevo Usuario</h2>
 
        {error && <div className="error-message">{error}</div>}
 
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
 
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmar contraseña"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono (opcional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
 
          <div className="input-group">
            <FaIdCard className="input-icon" />
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
            >
              <option value={2}>Usuario Normal</option>
              <option value={1}>Administrador</option>
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
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default UserModal;