
import './tema.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from './services/api';
import { CarritoContext } from './context/CarritoContext';
import { FavoritosContext } from './context/FavoritosContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Cartelera from './views/Cartelera';
import DetallePelicula from './views/DetallePelicula';
import Butacas from './views/Butacas';
import Kiosco from './views/Kiosco';
import Carrito from './views/Carrito';
import CarritoView from './views/CarritoView';
import ModalReservaVencida from './components/carrito/ModalReservaVencida';
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
import AdminDescuentosView from './views/admin/AdminDescuentosView';









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
  
  const [carrito, setCarrito] = useState(null);
  const [errorCarrito, setErrorCarrito] = useState(null);
  // Datos del modal "se terminó el tiempo de reserva" (null = cerrado).
  const [vencimiento, setVencimiento] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const [recargasCarrito, setRecargasCarrito] = useState(0);
  const pedidoCarritoRef = useRef(null);

  const recargarCarrito = useCallback(() => {
    setRecargasCarrito((veces) => veces + 1);
  }, []);

  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    pedidoCarritoRef.current = controller;
    apiFetch('/api/carritos', { token, signal: controller.signal })
      .then((data) => {
        setCarrito(data);
        setErrorCarrito(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('No se pudo cargar el carrito', err);
        setErrorCarrito(err.message || 'No se pudo cargar el carrito.');
      });

    return () => controller.abort();
  }, [token, location.pathname, recargasCarrito]);

  const actualizarCarrito = useCallback((nuevoCarrito) => {
    pedidoCarritoRef.current?.abort();
    setCarrito(nuevoCarrito);
    setErrorCarrito(null);
  }, []);

  const vaciarCarritoLocal = useCallback(() => {
    pedidoCarritoRef.current?.abort();
    setCarrito((actual) =>
      actual === null
        ? actual
        : { ...actual, items: [], total: 0, funcionId: null, expiraEn: null, vencido: false }
    );
    setErrorCarrito(null);
  }, []);

  const reintentarCarrito = useCallback(() => {
    setErrorCarrito(null);
    recargarCarrito();
  }, [recargarCarrito]);

  const carritoVisible = token === '' ? null : carrito;
  const cantidadVisible = (carritoVisible?.items ?? []).reduce(
    (total, item) => total + (item.cantidad ?? 1),
    0
  );
  const errorCarritoVisible = carritoVisible === null ? errorCarrito : null;

  // Favoritos del usuario: se piden una sola vez por sesion y los comparten cartelera, detalle y perfil.
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    apiFetch('/favoritos', { token, signal: controller.signal })
      .then((data) => setFavoritos(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('No se pudieron cargar los favoritos', err);
      });

    return () => controller.abort();
  }, [token]);

  const favoritosVisibles = token === '' ? [] : favoritos;

  const esFavorita = (idPelicula) => favoritosVisibles.some((f) => f.peliculaId === idPelicula);

  // Agrega o quita sin recargar: actualiza la lista al instante y la revierte si el pedido falla.
  const alternarFavorita = (pelicula) => {
    const quitar = esFavorita(pelicula.id);
    const nuevo = {
      peliculaId: pelicula.id,
      titulo: pelicula.titulo,
      poster_url: pelicula.poster_url,
      clasificacion: pelicula.clasificacion,
      agregadoEn: new Date().toISOString(),
    };
    const aplicar = (agregar) => (lista) => {
      const sinPelicula = lista.filter((f) => f.peliculaId !== pelicula.id);
      return agregar ? [nuevo, ...sinPelicula] : sinPelicula;
    };

    setFavoritos(aplicar(!quitar));
    apiFetch(`/favoritos/${pelicula.id}`, { token, method: quitar ? 'DELETE' : 'POST' }).catch((err) => {
      console.error('No se pudo actualizar el favorito', err);
      setFavoritos(aplicar(quitar));
    });
  };

  const esAdmin = rol === 'ADMIN';

  
  const cerrarSesion = (destino = '/') => {
    setToken('');
    setRol(null);
    setCarrito(null);
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
    if (!carritoAbierto) recargarCarrito();
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
    <CarritoContext.Provider
      value={{
        carrito: carritoVisible,
        cantidad: cantidadVisible,
        error: errorCarritoVisible,
        actualizarCarrito,
        vaciarCarritoLocal,
        recargarCarrito,
        reintentarCarrito,
        avisarVencimiento: setVencimiento,
      }}
    >
    <FavoritosContext.Provider
      value={{ haySesion: token !== '', favoritos: favoritosVisibles, esFavorita, alternar: alternarFavorita }}
    >
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
          <Route path="descuentos" element={<AdminDescuentosView />} />
          <Route path="ordenes" element={<AdminOrdenesView />} />
        </Route>

        {/* Mi Perfil ya no es una pagina: es el desplegable del nav. Si alguien
            entra a /perfil (un link viejo), va al inicio. */}
        <Route path="/perfil" element={<Navigate to="/" replace />} />
      </Routes>

      {!esRutaAdmin && location.pathname !== '/login' && <Footer haySesion={token !== ''} />}

      <ModalReservaVencida
        vencimiento={vencimiento}
        token={token}
        onNavegar={navegarDesdeCarrito}
        onCerrar={() => setVencimiento(null)}
      />
    </FavoritosContext.Provider>
    </CarritoContext.Provider>
  );
}

export default App;