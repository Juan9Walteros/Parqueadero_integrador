import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
 
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
 
      // Guarda el token en el almacenamiento local
      localStorage.setItem("token", response.data.token);
 
      setMessage("Inicio de sesión exitoso");
    } catch (err) {
      setMessage("Error: Credenciales incorrectas o problema con el servidor.");
    }
  };
 
  return (
<div className="container mt-5">
<h1>Iniciar Sesión</h1>
<form onSubmit={handleSubmit}>
<div className="mb-3">
<label htmlFor="email" className="form-label">
            Correo Electrónico
</label>
<input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
</div>
<div className="mb-3">
<label htmlFor="password" className="form-label">
            Contraseña
</label>
<input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
</div>
<button type="submit" className="btn btn-primary">
          Iniciar Sesión
</button>
</form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
</div>
  );
};
 
export default Login;