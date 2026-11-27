
import './tema.css';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerfil, cerrarSesion as cerrarSesionStore } from './redux/usuarioSlice';
import { fetchCarrito, limpiarCarrito, setVencimiento } from './redux/carritoSlice';
import { fetchFavoritos, limpiarFavoritos } from './redux/favoritosSlice';
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









function App() {
  // El usuario (token y rol) vive en Redux: ver src/redux/usuarioSlice.js
  const { token, rol } = useSelector((state) => state.usuario);
  const dispatch = useDispatch();
  
  
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  // Carrito y favoritos viven en Redux: ver src/redux/carritoSlice.js y favoritosSlice.js
  const { carrito, vencimiento } = useSelector((state) => state.carrito);
  const navigate = useNavigate();
  const location = useLocation(); 

  // Cada página nueva arranca arriba. Con hash la página hace su propio scroll.
  useEffect(() => {
    if (location.hash !== '') return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  const cantidadVisible = (carrito?.items ?? []).reduce(
    (total, item) => total + (item.cantidad ?? 1),
    0
  );

  const esAdmin = rol === 'ADMIN';

  
  const cerrarSesion = () => {
    dispatch(cerrarSesionStore());
    dispatch(limpiarCarrito());
    dispatch(limpiarFavoritos());
    setCarritoAbierto(false);
    navigate('/');
  };

  // Solo se persiste el token: después de recargar la página el rol queda en null y se pide el perfil para recuperarlo. Después del login o el registro el rol ya vino en la respuesta, así que no se pide.
  useEffect(() => {
    if (token === '' || rol !== null) return;

    const cargarPerfil = async () => {
      const res = await dispatch(fetchPerfil());
      if (res.error) {
        // Token vencido o inválido: se cierra la sesión. Las rutas protegidas ya redirigen solas a /login cuando el token queda vacío.
        dispatch(cerrarSesionStore());
        dispatch(limpiarCarrito());
        dispatch(limpiarFavoritos());
      }
    };
    cargarPerfil();
  }, [dispatch, token, rol]);

  useEffect(() => {
    if (token === '') return;

    dispatch(fetchCarrito());
    dispatch(fetchFavoritos());
  }, [dispatch, token]);

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
    <>
      {}
      {!esRutaAdmin && (
        <Navigation
          haySesion={token !== ''}
          esAdmin={esAdmin}
          perfil={<PerfilView onLogout={() => cerrarSesion()} onIrAEntradas={irAEntradas} />}
          carrito={
            <CarritoView
              abierto={carritoAbierto}
              cantidad={cantidadVisible}
              onAlternar={alternarCarrito}
              onCerrar={cerrarCarrito}
              irA={navegarDesdeCarrito}
            />
          }
        />
      )}

      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/funcion/:id/butacas" element={<Butacas />} />
        <Route path="/kiosco" element={<Kiosco haySesion={token !== ''} irA={navigate} />} />
        <Route path="/login" element={<Login />} />

        {}
        <Route
          path="/carrito"
          element={
            token !== '' ? (
              <Carrito irA={navigate} />
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

        {/* Mi Perfil ya no es una página: es el desplegable del nav. Si alguien entra a /perfil, va al inicio. */}
        <Route path="/perfil" element={<Navigate to="/" replace />} />
      </Routes>

      {!esRutaAdmin && location.pathname !== '/login' && <Footer haySesion={token !== ''} />}

      <ModalReservaVencida
        vencimiento={vencimiento}
        irA={navegarDesdeCarrito}
        onCerrar={() => dispatch(setVencimiento(null))}
      />
    </>
  );
}

export default App;