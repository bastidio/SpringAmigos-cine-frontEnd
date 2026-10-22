// tema.css va primero: asi los estilos de cada componente pueden pisarlo.
import './tema.css';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Butacas from './views/Butacas';
import Kiosco from './views/Kiosco';
import Carrito from './views/Carrito';
import Checkout from './views/Checkout';
import MisEntradas from './views/MisEntradas';
import Login from './views/Login';
import PerfilView from './views/PerfilView';
import AdminLayout from './components/admin/layout/AdminLayout';
import AdminDashboardView from './views/admin/AdminDashboard';
import AdminPeliculasView from './views/admin/AdminPeliculasView';
import AdminFuncionesView from './views/admin/AdminFuncionesView';
import AdminSalasView from './views/admin/AdminSalasView';
import AdminKioscoView from './views/admin/AdminKioscoView';
import AdminOrdenesView from './views/admin/AdminOrdenesView';


// Averigua el rol sin tocar el back: ni el token ni GET /users/me traen el
// rol, asi que se le pide algo que solo puede ver un admin. GET /ordenes
// (todas las ordenes) esta restringido a ADMIN en el SecurityConfig:
//   200 -> es ADMIN
//   403 -> esta logueado pero no es admin (USER)
//   401 -> el token vencio o no sirve: hay que volver al login
// Ojo: si algun dia cambian los permisos de GET /ordenes, esto hay que revisarlo.
const obtenerRol = async (token, signal) => {
  const res = await fetch('/ordenes', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  if (res.status === 401) {
    throw new Error('SESION_VENCIDA');
  }
  if (res.status === 403) {
    return 'USER';
  }
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar el rol`);
  }
  return 'ADMIN';
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  // null = todavia no se sabe (se esta consultando); '' = sin rol.
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Agregado para saber en qué URL estamos

  const esAdmin = rol === 'ADMIN';

  // Al cerrar sesion se borran el token y el rol.
  const cerrarSesion = (destino = '/') => {
    setToken('');
    setRol(null);
    localStorage.removeItem('token');
    navigate(destino);
  };

  // Si hay que preguntar el rol y el back dice 401, la sesion no sirve mas:
  // se borra todo y se manda al login. Cualquier otro error deja al usuario
  // como cliente comun (sin acceso al admin).
  const manejarErrorRol = (err) => {
    if (err.message === 'SESION_VENCIDA') {
      cerrarSesion('/login');
      return;
    }
    console.error(err);
    setRol('');
  };

  // Despues del login se pide el rol y, segun cual sea, se elige a donde ir.
  const iniciarSesion = async (nuevoToken) => {
    setToken(nuevoToken);
    localStorage.setItem('token', nuevoToken);

    try {
      const rolNuevo = await obtenerRol(nuevoToken);
      setRol(rolNuevo);
      navigate(rolNuevo === 'ADMIN' ? '/admin/dashboard' : '/');
    } catch (err) {
      manejarErrorRol(err);
      if (err.message !== 'SESION_VENCIDA') navigate('/');
    }
  };

  // MONTAJE: si al abrir la app ya habia un token guardado (por ejemplo,
  // despues de recargar la pagina), se pregunta el rol una sola vez.
  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    obtenerRol(token, controller.signal)
      .then(setRol)
      .catch((err) => {
        if (err.name !== 'AbortError') manejarErrorRol(err);
      });

    // DESMONTAJE: si App se desmonta antes de la respuesta, se cancela.
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const irAEntradas = () => {
    navigate('/mis-entradas');
  };

  // Verificamos si estamos en una ruta de administrador
  const esRutaAdmin = location.pathname.startsWith('/admin');

  // Que mostrar en /admin/*: sin sesion, al login; con sesion pero todavia
  // sin saber el rol, un aviso; sin rol ADMIN (por ejemplo, alguien que
  // escribio la URL a mano), al inicio.
  let rutaAdmin;
  if (token === '') {
    rutaAdmin = <Navigate to="/login" replace />;
  } else if (rol === null) {
    rutaAdmin = <p className="pagina_mensaje">Verificando permisos...</p>;
  } else if (esAdmin) {
    rutaAdmin = <AdminLayout onLogout={() => cerrarSesion()} />;
  } else {
    rutaAdmin = <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Solo renderiza la barra del cliente si NO estamos en el admin */}
      {!esRutaAdmin && (
        <Navigation
          haySesion={token !== ''}
          esAdmin={esAdmin}
          perfil={<PerfilView token={token} onLogout={() => cerrarSesion()} onIrAEntradas={irAEntradas} />}
        />
      )}

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/funcion/:id/butacas" element={<Butacas />} />
        <Route path="/kiosco" element={<Kiosco />} />
        <Route path="/login" element={<Login onAutenticado={iniciarSesion} />} />

        {/* Carrito, checkout y entradas son del usuario logueado: sin token, al login. */}
        <Route path="/carrito" element={token !== '' ? <Carrito /> : <Navigate to="/login" replace />} />
        <Route path="/checkout" element={token !== '' ? <Checkout /> : <Navigate to="/login" replace />} />
        <Route
          path="/mis-entradas"
          element={token !== '' ? <MisEntradas /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/admin"
          element={rutaAdmin}
        >
          <Route index element={<AdminDashboardView />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="peliculas" element={<AdminPeliculasView />} />
          <Route path="funciones" element={<AdminFuncionesView />} />
          <Route path="salas" element={<AdminSalasView />} />
          <Route path="kiosco" element={<AdminKioscoView />} />
          <Route path="ordenes" element={<AdminOrdenesView />} />
        </Route>

        {/* Mi Perfil ya no es una pagina: es el desplegable del nav. Si alguien
            entra a /perfil (un link viejo), va al inicio. */}
        <Route path="/perfil" element={<Navigate to="/" replace />} />
      </Routes>

      {!esRutaAdmin && location.pathname !== '/login' && <Footer />}
    </>
  );
}

export default App;