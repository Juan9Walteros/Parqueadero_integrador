import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: '',
    documento: '',
    email: '',
    phone: '',
    id_rol: 2,
    password: '',
    password_confirmation: '' // Campo adicional para confirmación
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.user) {
          setUser({
            name: response.data.user.name || '',
            documento: response.data.user.documento || '',
            email: response.data.user.email || '',
            phone: response.data.user.phone || '',
            id_rol: response.data.user.id_rol || 2,
            password: '', // Dejamos vacío para nueva contraseña
            password_confirmation: '' // Inicializamos confirmación
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica de contraseña
    if (user.password && user.password !== user.password_confirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/api/users/${id}`, {
        name: user.name,
        documento: user.documento,
        email: user.email,
        phone: user.phone,
        id_rol: user.id_rol,
        password: user.password || undefined, // Envía undefined si está vacío
        password_confirmation: user.password ? user.password_confirmation : undefined
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess('Usuario actualizado correctamente');
      setTimeout(() => navigate('/usuarios'), 1500);
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(
        err.response?.data?.message || 
        Object.values(err.response?.data?.errors || {}).flat().join(', ') || 
        'Error al actualizar usuario'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando usuario...</div>;

  return (
    <div className="user-edit-container">
      <h1>Editar Usuario</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Documento</label>
          <input
            type="documento"
            name="documento"
            value={user.documento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <select
            name="id_rol"
            value={user.id_rol}
            onChange={handleChange}
            required
          >
            <option value={1}>Admin</option>
            <option value={2}>Usuario</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nueva Contraseña (dejar vacío para mantener la actual)</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {user.password && (
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              name="password_confirmation"
              value={user.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;