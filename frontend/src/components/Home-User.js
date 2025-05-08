import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './Home.css';

const UserHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Parking</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </header>

      <main className="content-area">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Parking</h2>
          <p>¡Hola! Este es el panel de usuario del sistema de parqueadero.</p>
        </div>

        <div className="instructions-section">
          <h3>Instrucciones de Uso</h3>
          <ul>
            <li>Para acceder al parqueadero, presenta tu carnet físico y el carnet virtual de la aplicación universitaria.</li>
            <li>Escanea tu carnet a la hora de entrada y a la hora de salida en los lectores disponibles.</li>
            <li>En caso de errores o si necesitas editar alguna información, por favor comunícate con un administrador.</li>
          </ul>
        </div>

        <div className="contact-admin-message">
          <p><strong>⚠️ Importante:</strong> Si deseas actualizar tu información personal o la de tus vehículos, contacta a un administrador del sistema.</p>
        </div>
      </main>
    </div>
  );
};

export default UserHome;
