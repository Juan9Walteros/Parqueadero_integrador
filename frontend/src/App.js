import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from './components/Home'; // Renombrado a HomeLayout para mayor claridad
import Users from './components/Users';
import Vehicles from './components/Vehicles';
import Parkings from './components/Parkings';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta login */}
        <Route path="/" element={<Login />} />
        
        {/* Layout principal (solo para /home) */}
        <Route path="/home" element={<HomeLayout />} />
        
        {/* Rutas completamente independientes */}
        <Route path="/home/vehicles" element={<Vehicles />} />
        <Route path="/home/parkings" element={<Parkings />} />
        
        {/* Redirecciones */}
        <Route path="/home" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;