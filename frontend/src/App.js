import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Users from './components/Users';
import Vehicles from './components/Vehicles';
import Parkings from './components/Parkings';
import Login from './components/Login';
import Register from './components/Register';
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/vehiculos" element={<Vehicles />} />
        <Route path="/estacionamientos" element={<Parkings />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;