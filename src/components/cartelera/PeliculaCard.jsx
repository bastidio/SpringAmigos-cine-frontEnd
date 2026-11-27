import FavoritoBoton from './FavoritoBoton';
import IconoButaca from './IconoButaca';

// Componente que recibe todo listo por props (las funciones ya vienen filtradas y formateadas desde PeliculaList) y solo lo muestra.
const PeliculaCard = ({ id, titulo, poster_url, clasificacion, funciones, estreno, verDetalle, reservar }) => {
  return (
    <article className="pelicula-card">
      <div
        className="pelicula-card_fondo"
        style={{ backgroundImage: `url("${poster_url}")` }}
        aria-hidden="true"
      />
      <div className="pelicula-card_velo" aria-hidden="true" />

      <div className="pelicula-card_contenido">
        <div className="pelicula-card_marco">
          <button
            type="button"
            className="pelicula-card_boton-poster"
            onClick={() => verDetalle(id)}
            aria-label={`Ver detalle de ${titulo}`}
          >
            {poster_url ? (
              <img className="pelicula-card_poster" src={poster_url} alt={titulo} loading="lazy" />
            ) : (
              <span className="pelicula-card_poster sin-imagen">Sin póster</span>
            )}
          </button>

          {clasificacion && <span className="pelicula-card_clasificacion">{clasificacion}</span>}

          <FavoritoBoton
            pelicula={{ id, titulo, poster_url, clasificacion }}
            className="absolute left-2.5 top-2.5 z-[1]"
          />
        </div>

        <h3 className="pelicula-card_titulo">
          <button type="button" className="pelicula-card_boton-titulo" onClick={() => verDetalle(id)}>
            {titulo}
          </button>
        </h3>

        {estreno && <p className="pelicula-card_estreno">{estreno}</p>}

        <div className="pelicula-card_funciones">
          <p className="pelicula-card_rotulo">Próximas funciones</p>
          <div className="pelicula-card_funciones-cuerpo">
            {funciones.length === 0 ? (
              <p className="pelicula-card_sin-funciones">Sin funciones próximas</p>
            ) : (
              <div className="pelicula-card_funciones-grilla">
                {funciones.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`pelicula-card_funcion${f.premium ? ' pelicula-card_funcion--vip' : ''}`}
                    title={`${f.sala} · ${f.disponibilidad.texto}`}
                    disabled={f.disponibilidad.nivel === 'agotada'}
                    onClick={() => reservar(f.id)}
                  >
                    <span className="pelicula-card_dia">{f.dia}</span>
                    <span className="pelicula-card_hora">{f.hora}</span>
                    <span className="pelicula-card_idioma">
                      {f.idioma}
                      {f.premium && ' · VIP'}
                    </span>
                    {f.disponibilidad.nivel === 'agotada' ? (
                      <span className="pelicula-card_agotada">Agotada</span>
                    ) : (
                      <IconoButaca nivel={f.disponibilidad.nivel} tamano={12} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PeliculaCard;
