import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import UserModal from './UserModal';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data.users || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      try {
        await axios.delete(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Usuario eliminado correctamente');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar usuario');
      }
    }
  };

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
    setSuccess('Usuario creado correctamente');
    setShowModal(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <h2>Gestión de Usuarios</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="users-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="add-user-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.id_rol === 1 ? 'Admin' : 'Usuario'}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  {loading ? 'Cargando...' : 'No se encontraron usuarios'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          onClose={() => setShowModal(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
};

export default Users;