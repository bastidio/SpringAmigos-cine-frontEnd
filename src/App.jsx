// tema.css va primero: asi los estilos de cada componente pueden pisarlo.
import './tema.css';
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Kiosco from './views/Kiosco';
import Login from './views/Login';

// App no es una vista: define que vista se muestra en cada URL.
function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Cuando el login o el registro consiguen un token, se guarda y se vuelve
  // a la cartelera.
  const iniciarSesion = (nuevoToken) => {
    setToken(nuevoToken);
    navigate('/');
  };

  const cerrarSesion = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <>
      <Navigation haySesion={token !== null} cerrarSesion={cerrarSesion} />

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/kiosco" element={<Kiosco />} />
        <Route path="/login" element={<Login onAutenticado={iniciarSesion} />} />
      </Routes>
    </>
  );
}

export default App;
