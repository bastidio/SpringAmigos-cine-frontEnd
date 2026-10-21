import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

// Barra de arriba. App la renderiza afuera de Routes, por eso aparece en
// todas las vistas. Para las palabras usa Link; para los botones, useNavigate.
// "perfil" es el menu desplegable de Mi Perfil (lo arma App); va en el lugar
// donde antes estaba "Cerrar sesion", que ahora esta adentro del perfil.
const Navigation = ({ haySesion, esAdmin, perfil }) => {
  // useLocation devuelve un objeto con la ubicacion actual; pathname es la
  // ruta. Sirve para pintar de otro color el link de la vista en la que estoy.
  const location = useLocation();
  const navigate = useNavigate();

  // Solo importa en celular: si el menu hamburguesa esta desplegado.
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleIngresar = () => {
    navigate('/login');
  };

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Al tocar un link o un boton del menu, se cierra.
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="nav">
      <div className="nav_contenido">
        <Link to="/" className="nav_marca" onClick={cerrarMenu}>
          <span className="nav_rombo">◈</span>
          <span className="nav_nombre">
            Spring<span className="nav_nombre-acento">Amigos</span>
          </span>
          <span className="nav_cine">Cine</span>
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
            {/* Solo los admin ven el acceso al panel. */}
            {esAdmin && (
              <Link to="/admin/dashboard" className="nav_link">
                Panel admin
              </Link>
            )}
          </nav>

          <div className="nav_acciones max-md:w-full">
            <Link
              to="/carrito"
              className={
                location.pathname === '/carrito'
                  ? 'nav_carrito nav_carrito--activo'
                  : 'nav_carrito'
              }
              aria-label="Ir al carrito"
              title="Carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>

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
