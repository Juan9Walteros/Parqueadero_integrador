import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    id_rol: 2 // Puedes dejarlo fijo o hacerlo editable
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/home'); // ✅ redirigir a Home después de crear
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      <h1>Crear Usuario</h1>

      {error && <div className="error-message">{error}</div>}

      <form className="create-user-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Confirmar Contraseña:
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono:
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rol:
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
          >
            <option value={1}>Admin</option>
            <option value={2}>Usuario</option>
          </select>
        </label>

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </button>
          <button type="button" onClick={() => navigate('/home')}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
