import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      // Guardar datos de autenticación
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id); // Guardar el ID del usuario
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setMessage("Inicio de sesión exitoso");
      
      // Redirección según el ID del usuario
      setTimeout(() => {
        if (response.data.user.id === 1) {
          navigate("/home"); // Admin
        } else {
          navigate("/home-user"); // Usuario regular
        }
      }, 1000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Error en las credenciales");
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>
        
        <div className="input-box">
          <input 
            type="email" 
            placeholder='Correo Electrónico' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <FaUser className='icon' />
        </div>
        
        <div className="input-box">
          <input 
            type="password" 
            placeholder='Contraseña' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <FaLock className='icon' />
        </div>
        
        <div className="remember-forgot">
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Recordarme
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
        
        <button type="submit">Iniciar Sesión</button>
        
        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="register-link">
          <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;