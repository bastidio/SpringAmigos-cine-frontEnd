import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/lumiere-logo.svg';
import logotipo from '../assets/lumiere-logotipo.png';
import './Navigation.css';






const Navigation = ({ haySesion, esAdmin, perfil, carrito }) => {
  
  
  const location = useLocation();
  const navigate = useNavigate();

  
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleIngresar = () => {
    navigate('/login');
  };

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="nav">
      <div className="nav_contenido">
        <Link to="/" className="nav_marca" onClick={cerrarMenu}>
          <img className="nav_logo" src={logo} alt="Lumière" />
          <img className="nav_logotipo" src={logotipo} alt="" />
        </Link>

        {/* Boton hamburguesa: solo se ve en pantallas chicas. Las tres rayas
            se convierten en una X cuando el menu esta abierto. */}
        <button
          type="button"
          className="flex flex-col justify-center gap-1.5 w-10 h-10 p-2 bg-transparent border-0 rounded cursor-pointer md:hidden focus-visible:outline-2 focus-visible:outline-[var(--morado)]"
          onClick={alternarMenu}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="nav-menu"
        >
          <span
            className={`block h-0.5 w-6 bg-[var(--texto)] transition-transform duration-200 ${menuAbierto ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--texto)] transition-opacity duration-200 ${menuAbierto ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--texto)] transition-transform duration-200 ${menuAbierto ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>

        {/* En celular es un panel que cae debajo de la barra. En desktop,
            md:contents hace que este div "desaparezca" y los links y las acciones
            queden repartidos por el justify-between. */}
        <div
          id="nav-menu"
          className={`md:contents max-md:absolute max-md:inset-x-0 max-md:top-full max-md:flex-col max-md:gap-4 max-md:px-6 max-md:py-4 max-md:bg-[var(--fondo)] max-md:border-b max-md:border-[var(--borde)] ${menuAbierto ? 'max-md:flex' : 'max-md:hidden'}`}
          onClick={cerrarMenu}
        >
          <nav className="nav_links max-md:flex-col max-md:items-start max-md:gap-4">
            <Link
              to="/"
              className={location.pathname === '/' ? 'nav_link nav_link--activo' : 'nav_link'}
            >
              Cartelera
            </Link>
            <Link
              to="/kiosco"
              className={
                location.pathname === '/kiosco' ? 'nav_link nav_link--activo' : 'nav_link'
              }
            >
              Kiosco
            </Link>
            {}
            {esAdmin && (
              <Link to="/admin/dashboard" className="nav_link">
                Panel admin
              </Link>
            )}
          </nav>

          <div className="nav_acciones max-md:w-full">
            {carrito}

            {haySesion ? (
              perfil
            ) : (
              <button
                type="button"
                className="boton boton--primario nav_boton max-md:flex-1"
                onClick={handleIngresar}
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
