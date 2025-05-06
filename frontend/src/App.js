// filepath: c:\Users\dtc59\Desktop\Parqueadero_Integrador\Parqueadero_Integrador\Parqueadero_Integrador\parqueadero\frontend\src\App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Users from "./components/Users";
import Vehicles from "./components/Vehicles"
import Parkings from "./components/Parkings"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/parkings" element={<Parkings />} />
      </Routes>
    </Router>
  );
};

export default App;