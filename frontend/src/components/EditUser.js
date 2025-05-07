import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';

const UserEdit = () => {
  const { id } = useParams();  // Usamos useParams para obtener el ID de la URL
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null); // Inicializamos user como null
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga, inicia como true
  const [confirmPassword, setConfirmPassword] = useState(''); // Para la confirmación de contraseña

  // UseEffect para cargar los datos del usuario cuando el componente se monta
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Hacemos que el loading empiece al comenzar
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.user) {
          setUser(response.data.user); // Establecemos el usuario recibido de la API
          setLoading(false); // Terminamos el loading
        } else {
          setError('Usuario no encontrado');
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.error("Error al obtener el usuario:", err);
        setError(err.response ? err.response.data.message || 'Error desconocido' : 'Error al obtener el usuario');
      }
    };

    fetchUser(); // Llamamos a la función para obtener el usuario
  }, [id]);

  // Si el componente está cargando, mostramos un mensaje
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no encontramos al usuario, mostramos un mensaje de error
  if (!user) {
    return <div>No se encontró el usuario</div>;
  }

  // Función para manejar el cambio en los campos de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value, // Actualizamos solo el campo que ha cambiado
    }));
  };

  // Función para manejar el cambio en el campo de confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Función para manejar el envío del formulario de edición
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Verificación de que las contraseñas coinciden
    if (user.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return; // Si las contraseñas no coinciden, no enviamos el formulario
    }

    setLoading(true); // Activamos el estado de carga
    setError(''); // Limpiamos el mensaje de error
    setSuccess(''); // Limpiamos el mensaje de éxito

    try {
      const response = await axios.put(`/api/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.user) {
        setSuccess('Usuario actualizado correctamente');
        setLoading(false);
        navigate('/usuarios'); // Redirigimos a la lista de usuarios
      }
    } catch (err) {
      setLoading(false);
      console.error("Error al actualizar el usuario:", err);
      if (err.response && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('Hubo un error al actualizar el usuario');
      }
    }
  };

  return (
    <div className="user-edit-container">
      <header className="header">
        <h1>Editar Usuario</h1>
      </header>

      <main>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={user.name || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              type="text"
              name="phone"
              value={user.phone || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Rol</label>
            <select
              name="role_id"
              value={user.role_id || 2} // Si no hay rol, asignamos el rol por defecto 'Usuario'
              onChange={handleChange}
            >
              <option value={1}>Admin</option>
              <option value={2}>Usuario</option>
            </select>
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={user.password || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default UserEdit;
