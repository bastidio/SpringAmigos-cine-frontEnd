// tema.css va primero: asi los estilos de cada componente pueden pisarlo.
import './tema.css';
import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Kiosco from './views/Kiosco';
import Login from './views/Login';
import PerfilView from './views/PerfilView';

// App no es una vista: define que vista se muestra en cada URL.
function App() {
  // El token JWT vive solo en este estado (nada de localStorage) y baja a
  // las vistas por props. String vacio = no hay sesion.
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Cuando el login o el registro consiguen un token, se guarda y se vuelve
  // a la cartelera.
  const iniciarSesion = (nuevoToken) => {
    setToken(nuevoToken);
    navigate('/');
  };

  // No le avisa nada al back: con borrar el token alcanza.
  const cerrarSesion = () => {
    setToken('');
    navigate('/');
  };

  const irAEntradas = () => {
    navigate('/mis-entradas');
  };

  return (
    <>
      <Navigation haySesion={token !== ''} cerrarSesion={cerrarSesion} />

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/kiosco" element={<Kiosco />} />
        <Route path="/login" element={<Login onAutenticado={iniciarSesion} />} />
        {/* Sin sesion no hay perfil que mostrar: se manda al login. */}
        <Route
          path="/perfil"
          element={
            token !== '' ? (
              <PerfilView token={token} onLogout={cerrarSesion} onIrAEntradas={irAEntradas} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
