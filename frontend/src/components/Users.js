import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaTrash, FaSignOutAlt, FaCar, FaParking, FaUser } from 'react-icons/fa';
import UserModal from './UserModal';
import './Users.css';
 
const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  return (
    <div className="users-container">
      <header className="home-header">
        <h1>Gestión de Usuarios</h1>
        <button onClick={() => navigate('/')} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>
 
      <nav className="sections-nav">
        <button className="section-btn" onClick={() => navigate('/home')}>
          Home
        </button>
        <button className="section-btn active">
          <FaUser /> Usuarios
        </button>
        <button className="section-btn" onClick={() => navigate('/vehiculos')}>
          <FaCar /> Vehículos
        </button>
        <button className="section-btn" onClick={() => navigate('/estacionamientos')}>
          <FaParking /> Estacionamientos
        </button>
      </nav>
 
      <main className="content-area">
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
            onClick={() => setShowCreateModal(true)}
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
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.role_id === 1 ? 'Admin' : 'Usuario'}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => console.log('Eliminar usuario', user.id)}
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
 
        {showCreateModal && (
          <UserModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={(newUser) => setUsers([...users, newUser])}
          />
        )}
      </main>
    </div>
  );
};
 
export default Users;