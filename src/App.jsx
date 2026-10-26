
import './tema.css';
import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from './services/api';
import { CarritoContext } from './context/CarritoContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Butacas from './views/Butacas';
import Kiosco from './views/Kiosco';
import Carrito from './views/Carrito';
import CarritoView from './views/CarritoView';
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
  
  const [rol, setRol] = useState(null);
  
  
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const [avisosCarrito, setAvisosCarrito] = useState(0);
  const refrescarCantidad = useCallback(() => {
    setAvisosCarrito((avisos) => avisos + 1);
  }, []);

  
  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    apiFetch('/api/carritos', { token, signal: controller.signal })
      .then((data) => {
        setCantidadCarrito((data?.items ?? []).reduce((total, item) => total + (item.cantidad ?? 1), 0));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('No se pudo actualizar el contador del carrito', err);
      });

    
    return () => controller.abort();
  }, [token, location.pathname, avisosCarrito]);

  
  const cantidadVisible = token === '' ? 0 : cantidadCarrito;

  const esAdmin = rol === 'ADMIN';

  
  const cerrarSesion = (destino = '/') => {
    setToken('');
    setRol(null);
    setCarritoAbierto(false);
    localStorage.removeItem('token');
    navigate(destino);
  };

  
  
  
  const manejarErrorRol = (err) => {
    if (err.message === 'SESION_VENCIDA') {
      cerrarSesion('/login');
      return;
    }
    console.error(err);
    setRol('');
  };

  
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

  
  
  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    obtenerRol(token, controller.signal)
      .then(setRol)
      .catch((err) => {
        if (err.name !== 'AbortError') manejarErrorRol(err);
      });

    
    return () => controller.abort();
    
  }, []);

  const irAEntradas = () => {
    navigate('/mis-entradas');
  };

  
  const alternarCarrito = () => {
    if (token === '') {
      navigate('/login');
      return;
    }
    setCarritoAbierto(!carritoAbierto);
  };

  const cerrarCarrito = () => {
    setCarritoAbierto(false);
  };

  
  const navegarDesdeCarrito = (destino) => {
    setCarritoAbierto(false);
    navigate(destino);
  };

  
  const esRutaAdmin = location.pathname.startsWith('/admin');

  
  
  
  let rutaAdmin;
  if (token === '') {
    rutaAdmin = <Navigate to="/login" replace />;
  } else if (rol === null) {
    rutaAdmin = <p className="pagina_mensaje">Verificando permisos...</p>;
  } else if (esAdmin) {
    rutaAdmin = <AdminLayout token={token} onLogout={() => cerrarSesion()} onIrAEntradas={irAEntradas} />;
  } else {
    rutaAdmin = <Navigate to="/" replace />;
  }

  return (
    <CarritoContext.Provider value={{ refrescarCantidad, version: avisosCarrito }}>
      {}
      {!esRutaAdmin && (
        <Navigation
          haySesion={token !== ''}
          esAdmin={esAdmin}
          perfil={<PerfilView token={token} onLogout={() => cerrarSesion()} onIrAEntradas={irAEntradas} />}
          carrito={
            <CarritoView
              token={token}
              abierto={carritoAbierto}
              cantidad={cantidadVisible}
              onAlternar={alternarCarrito}
              onCerrar={cerrarCarrito}
              onNavegar={navegarDesdeCarrito}
            />
          }
        />
      )}

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/funcion/:id/butacas" element={<Butacas />} />
        <Route path="/kiosco" element={<Kiosco token={token} />} />
        <Route path="/login" element={<Login onAutenticado={iniciarSesion} />} />

        {}
        <Route
          path="/carrito"
          element={
            token !== '' ? (
              <Carrito token={token} onNavegar={navigate} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
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
    </CarritoContext.Provider>
  );
}

export default App;