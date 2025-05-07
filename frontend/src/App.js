import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Users from './components/Users';
import Vehicles from './components/Vehicles';
import Parkings from './components/Parkings';
import Login from './components/Login';
import Register from './components/Register';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import CreateVehicle from './components/CreateVehicle';
import UserHome from './components/Home-User';

 
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
        <Route path="/crear-usuario" element={<CreateUser />} />
        <Route path="/editar-usuario/:id" element={<EditUser />} />
        <Route path="/vehicles/create" element={<CreateVehicle />} />
        <Route path="/Home-User" element={<UserHome />} />

      </Routes>
    </BrowserRouter>
  );
}
 
export default App;