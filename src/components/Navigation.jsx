import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

// Barra de arriba. App la renderiza afuera de Routes, por eso aparece en
// todas las vistas. Para las palabras usa Link; para los botones, useNavigate.
const Navigation = ({ haySesion, cerrarSesion }) => {
  // useLocation devuelve un objeto con la ubicacion actual; pathname es la
  // ruta. Sirve para pintar de otro color el link de la vista en la que estoy.
  const location = useLocation();
  const navigate = useNavigate();

  const handleIngresar = () => {
    navigate('/login');
  };

  return (
    <header className="nav">
      <div className="nav__contenido">
        <Link to="/" className="nav__marca">
          <span className="nav__rombo">◈</span>
          <span className="nav__nombre">
            Spring<span className="nav__nombre-acento">Amigos</span>
          </span>
          <span className="nav__cine">Cine</span>
        </Link>

        <nav className="nav__links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav__link nav__link--activo' : 'nav__link'}
          >
            Cartelera
          </Link>
          <Link
            to="/kiosco"
            className={
              location.pathname === '/kiosco' ? 'nav__link nav__link--activo' : 'nav__link'
            }
          >
            Kiosco
          </Link>
        </nav>

        {haySesion ? (
          <button type="button" className="boton boton--secundario nav__boton" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        ) : (
          <button type="button" className="boton boton--primario nav__boton" onClick={handleIngresar}>
            Ingresar
          </button>
        )}
      </div>
    </header>
  );
};

export default Navigation;
