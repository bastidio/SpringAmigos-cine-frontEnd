import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { agregarFavorito, quitarFavorito } from '../../redux/favoritosSlice';

// Corazón para agregar o sacar una película favorita. La lista sale del store (favoritos).
const FavoritoBoton = ({ pelicula, className = '' }) => {
  const { token } = useSelector((state) => state.usuario);
  const { items } = useSelector((state) => state.favoritos);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const haySesion = token !== '';
  const activa = items.some((f) => f.peliculaId === pelicula.id);

  // La lista cambia cuando responde el back (en el fulfilled del thunk).
  const manejarClick = () => {
    if (!haySesion) {
      navigate('/login');
      return;
    }
    dispatch(activa ? quitarFavorito(pelicula.id) : agregarFavorito(pelicula));
  };

  return (
    <button
      type="button"
      onClick={manejarClick}
      aria-pressed={activa}
      aria-label={activa ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-black/60 p-0 text-[var(--dorado)] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[var(--morado-texto)] ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={activa ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
};

export default FavoritoBoton;
