import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/lumiere-logo.svg';
import logotipo from '../../../assets/lumiere-logotipo.png';

// Cada link con su icono (trazos de 24x24, sin relleno: toman el color del texto).
const ENLACES = [
  {
    ruta: '/admin',
    texto: 'Dashboard',
    icono: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
  },
  {
    ruta: '/admin/peliculas',
    texto: 'Películas',
    icono: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="2.2" />
        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
      </>
    ),
  },
  {
    ruta: '/admin/funciones',
    texto: 'Funciones',
    icono: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    ruta: '/admin/salas',
    texto: 'Salas',
    icono: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    ruta: '/admin/kiosco',
    texto: 'Kiosco',
    icono: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  {
    ruta: '/admin/ordenes',
    texto: 'Órdenes',
    icono: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  // Marca el link de la seccion en la que estoy. El Dashboard es /admin y
  // tambien /admin/dashboard (a donde manda el login y el nav del cliente).
  const estaActivo = (ruta) => {
    if (ruta === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(ruta);
  };

  return (
    <aside className="admin-sidebar">
      <Link to="/admin" className="admin-sidebar__marca" aria-label="Lumière Cine, ir al dashboard">
        <img className="admin-sidebar__logo" src={logo} alt="" />
        <img className="admin-sidebar__logotipo" src={logotipo} alt="Lumière Cine" />
      </Link>

      <p className="admin-sidebar__etiqueta">Administración</p>
      <nav>
        {ENLACES.map((enlace) => (
          <Link
            key={enlace.ruta}
            to={enlace.ruta}
            className={estaActivo(enlace.ruta) ? 'active' : ''}
            title={enlace.texto}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {enlace.icono}
            </svg>
            <span>{enlace.texto}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;