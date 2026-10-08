import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

// Barra de arriba. App la renderiza afuera de Routes, por eso aparece en
// todas las vistas. Para las palabras usa Link; para los botones, useNavigate.
const Navigation = ({ haySesion, cerrarSesion }) => {
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
      <div className="nav__contenido">
        <Link to="/" className="nav__marca" onClick={cerrarMenu}>
          <span className="nav__rombo">◈</span>
          <span className="nav__nombre">
            Spring<span className="nav__nombre-acento">Amigos</span>
          </span>
          <span className="nav__cine">Cine</span>
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
            md:contents hace que este div "desaparezca" y los links y el boton
            queden como estaban, repartidos por el justify-between. */}
        <div
          id="nav-menu"
          className={`md:contents max-md:absolute max-md:inset-x-0 max-md:top-full max-md:flex-col max-md:gap-4 max-md:px-6 max-md:py-4 max-md:bg-[var(--fondo)] max-md:border-b max-md:border-[var(--borde)] ${menuAbierto ? 'max-md:flex' : 'max-md:hidden'}`}
          onClick={cerrarMenu}
        >
          <nav className="nav__links max-md:flex-col max-md:items-start max-md:gap-4">
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
            <button type="button" className="boton boton--secundario nav__boton max-md:w-full" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          ) : (
            <button type="button" className="boton boton--primario nav__boton max-md:w-full" onClick={handleIngresar}>
              Ingresar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
