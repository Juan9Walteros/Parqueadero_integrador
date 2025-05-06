import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaPhone, FaIdCard } from 'react-icons/fa';
import './UserModal.css';

const UserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    id_rol: 2
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de contraseña
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación de campos requeridos
    if (!formData.name || !formData.email || !formData.password) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      // Llama a onSuccess si existe
      if (typeof onSuccess === 'function') {
        onSuccess(formData);
      } else {
        console.error('onSuccess no es una función');
      }
      
      onClose();
    } catch (err) {
      setError('Error al procesar el formulario');
      console.error(err);
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
              placeholder="Contraseña"
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
              placeholder="Teléfono"
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
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;