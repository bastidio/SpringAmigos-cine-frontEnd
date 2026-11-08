import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../context/FavoritosContext';
import FavoritoBoton from '../cartelera/FavoritoBoton';

// Fila compacta por pelicula favorita: poster chico, titulo (al detalle) y corazon para quitar.
const MisFavoritos = () => {
  const { favoritos } = useFavoritos();
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-solid border-white/10 bg-[var(--superficie)] p-6">
      <h2 className="m-0 font-serif text-lg font-bold text-white">Mis favoritos</h2>

      {favoritos.length === 0 ? (
        <p className="m-0 text-sm text-[var(--texto-suave)]">Todavía no guardaste ninguna película.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {favoritos.map((f) => (
            <li key={f.peliculaId} className="flex items-center gap-3">
              {f.poster_url ? (
                <img src={f.poster_url} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />
              ) : (
                <span className="h-14 w-10 shrink-0 rounded bg-[var(--elevado)]" aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => navigate(`/pelicula/${f.peliculaId}`)}
                className="min-w-0 flex-1 cursor-pointer truncate border-0 bg-transparent p-0 text-left text-sm font-semibold text-[var(--texto)] hover:text-[var(--dorado-texto)]"
              >
                {f.titulo}
              </button>
              <FavoritoBoton
                pelicula={{
                  id: f.peliculaId,
                  titulo: f.titulo,
                  poster_url: f.poster_url,
                  clasificacion: f.clasificacion,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MisFavoritos;
