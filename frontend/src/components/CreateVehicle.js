import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VehiclesCreate = () => {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [plate, setPlate] = useState('');
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [idType, setIdType] = useState('');
  
  // Estado para los usuarios
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Estado para el mensaje de error o éxito
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Obtener los usuarios para asignar el vehículo
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      plate,
      marca,
      model,
      color,
      id_user: selectedUserId, // El id del usuario seleccionado
      qr_code: qrCode,
      id_type: idType
    };

    try {
      const response = await axios.post('/api/vehicles', vehicleData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Vehículo registrado correctamente');
      navigate('/home'); // Redirigir a la lista de vehículos
    } catch (error) {
      console.error("Error al crear el vehículo:", error);
      setMessage('Hubo un error al registrar el vehículo');
    }
  };

  return (
    <div className="create-vehicle-container">
      <h2>Registrar Vehículo</h2>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="vehicle-form">
        <div className="form-group">
          <label>Placa:</label>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Marca:</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Color:</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Código QR:</label>
          <input
            type="text"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tipo de Vehículo:</label>
          <input
            type="text"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Selecciona un Usuario:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Registrar Vehículo</button>
        </div>
      </form>
    </div>
  );
};

export default VehiclesCreate;
