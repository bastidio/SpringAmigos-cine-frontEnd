// tema.css va primero: asi los estilos de cada componente pueden pisarlo.
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
  // Si el desplegable del carrito esta abierto. Vive aca (y no en el menu)
  // porque el carrito se puede abrir desde otras vistas, no solo del nav.
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  // Cuantos productos hay en el carrito (el numero del icono del nav).
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Agregado para saber en qué URL estamos

  // Suma 1 cada vez que alguien avisa que el carrito cambio (ver CarritoContext). Como el efecto de abajo depende de este numero, avisar alcanza para que se vuelva a pedir la cantidad.
  const [avisosCarrito, setAvisosCarrito] = useState(0);
  const refrescarCantidad = useCallback(() => {
    setAvisosCarrito((avisos) => avisos + 1);
  }, []);

  // MONTAJE / ACTUALIZACION: al abrir la app, al loguearse, al cambiar de pantalla y cuando alguien avisa, se pide el carrito y se cuentan las unidades (cada butaca cuenta 1). Cambiar de pantalla cubre lo que no avisa nadie: el carrito que vence a los 5 minutos. Si falla, el numero queda como estaba: el icono nunca rompe la pagina.
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

    // DESMONTAJE (o un aviso nuevo): se cancela el pedido en curso.
    return () => controller.abort();
  }, [token, location.pathname, avisosCarrito]);

  // Sin sesion el carrito no existe: se muestra 0 sin esperar a ningun pedido.
  const cantidadVisible = token === '' ? 0 : cantidadCarrito;

  const esAdmin = rol === 'ADMIN';

  // Al cerrar sesion se borran el token y el rol.
  const cerrarSesion = (destino = '/') => {
    setToken('');
    setRol(null);
    setCarritoAbierto(false);
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

  // Icono del carrito: sin sesion va al login; con sesion abre o cierra el desplegable.
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

  // Desde el carrito (ir a pagar, ver cartelera): se cierra y se navega.
  const navegarDesdeCarrito = (destino) => {
    setCarritoAbierto(false);
    navigate(destino);
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
    <CarritoContext.Provider value={{ refrescarCantidad, version: avisosCarrito }}>
      {/* Solo renderiza la barra del cliente si NO estamos en el admin */}
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

        {/* Carrito, checkout y entradas son del usuario logueado: sin token, al login. */}
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