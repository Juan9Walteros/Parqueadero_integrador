import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaUser, FaLock, FaPhone, FaIdCard, FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    documento: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    id_rol: 2
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Validaciones
    if (formData.password !== formData.password_confirmation) {
      setMessage("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        name: formData.name.trim(),
        documento: formData.documento.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone.trim(),
        id_rol: formData.id_rol
      });

      localStorage.setItem("token", response.data.token);
      setMessage("¡Registro exitoso! Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/", { state: { registrationSuccess: true } });
      }, 2000);

    } catch (err) {
      console.error("Error en el registro:", err);
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.message || "Error en el servidor";
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='auth-wrapper'>
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <FaArrowLeft /> Volver
      </button>

      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Crear Cuenta</h1>
        
        {message && (
          <div className={`auth-message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Nombre Completo"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="documento"
            placeholder="Cedula"
            value={formData.documento}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
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
            required
            pattern="[0-9]{10,15}"
            title="Número de teléfono válido (10-15 dígitos)"
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
            placeholder="Confirmar Contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaIdCard className="input-icon" />
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            className="role-select"
          >
            <option value="2">Usuario Normal</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Crear Cuenta"}
        </button>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? 
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="auth-link"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;