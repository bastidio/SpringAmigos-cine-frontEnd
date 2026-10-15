// tema.css va primero: asi los estilos de cada componente pueden pisarlo.
import './tema.css';
import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Butacas from './views/Butacas';
import Kiosco from './views/Kiosco';
import Login from './views/Login';
import PerfilView from './views/PerfilView';
import AdminLayout from './components/admin/layout/AdminLayout';
import AdminDashboardView from './views/admin/AdminDashboard';
import AdminPeliculasView from './views/admin/AdminPeliculasView';
import AdminFuncionesView from './views/admin/AdminFuncionesView';
import AdminSalasView from './views/admin/AdminSalasView';
import AdminKioscoView from './views/admin/AdminKioscoView';
import AdminOrdenesView from './views/admin/AdminOrdenesView';


const leerPayloadToken = (token) => {
  if (typeof token !== 'string') return null;

  const partes = token.split('.');
  if (partes.length !== 3 || !partes[1]) return null;

  try {
    const payloadBase64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(partes[1].length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(payloadBase64), (caracter) =>
      caracter.charCodeAt(0)
    );
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (
      payload.exp !== undefined &&
      (!Number.isFinite(Number(payload.exp)) ||
        Number(payload.exp) <= Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const tieneRolAdmin = (payload) => {
  if (!payload) return false;

  // Agregamos 'scope' a la lista de búsqueda
  const roles = [payload?.rol, payload?.role, payload?.roles, payload?.authorities, payload?.scope]
    .flatMap((valor) => {
      if (typeof valor === 'string') return valor.split(' '); // Separa si viene "read ROLE_ADMIN"
      if (Array.isArray(valor)) return valor;
      return [valor];
    })
    .map((valor) =>
      typeof valor === 'string' ? valor : valor?.authority ?? valor?.name
    )
    .filter((rol) => typeof rol === 'string')
    .map((rol) => rol.toUpperCase());

  return roles.some((rol) => rol === 'ADMIN' || rol === 'ROLE_ADMIN');
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const location = useLocation(); // Agregado para saber en qué URL estamos

  const iniciarSesion = (nuevoToken) => {
    const payload = leerPayloadToken(nuevoToken);
    if (!payload) {
      setToken('');
      console.error('El inicio de sesión no devolvió un token JWT válido y vigente.');
      navigate('/login');
      return;
    }

    // 1. Guardamos en React y en el Navegador
    setToken(nuevoToken);
    localStorage.setItem('token', nuevoToken);

    // 2. Imprimimos el payload para espiar qué manda tu backend
    console.log("Datos que llegan de Spring Boot:", payload);

    // 3. Verificamos y redirigimos
    if (tieneRolAdmin(payload)) {
      navigate('/admin/dashboard');
      return;
    }

    navigate('/');
  };

  const cerrarSesion = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  const irAEntradas = () => {
    navigate('/mis-entradas');
  };

  // Verificamos si estamos en una ruta de administrador
  const esRutaAdmin = location.pathname.startsWith('/admin');
  const tieneAccesoAdmin = tieneRolAdmin(leerPayloadToken(token));

  return (
    <>
      {/* Solo renderiza la barra del cliente si NO estamos en el admin */}
      {!esRutaAdmin && <Navigation haySesion={token !== ''} cerrarSesion={cerrarSesion} />}

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/funcion/:id/butacas" element={<Butacas />} />
        <Route path="/kiosco" element={<Kiosco />} />
        <Route path="/login" element={<Login onAutenticado={iniciarSesion} />} />
        
        <Route
          path="/admin"
          element={
            tieneAccesoAdmin ? (
              <AdminLayout onLogout={cerrarSesion} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<AdminDashboardView />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="peliculas" element={<AdminPeliculasView />} />
          <Route path="funciones" element={<AdminFuncionesView />} />
          <Route path="salas" element={<AdminSalasView />} />
          <Route path="kiosco" element={<AdminKioscoView />} />
          <Route path="ordenes" element={<AdminOrdenesView />} />
        </Route>
        
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