



const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dosDigitos = (n) => String(n).padStart(2, '0');

const etiquetaDia = (fecha, ahora) => {
  const inicioDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dias = Math.round((inicioDia(fecha) - inicioDia(ahora)) / 86400000);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  return `${DIAS[fecha.getDay()]} ${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}`;
};

const proximasFunciones = (funciones, ahora) =>
  funciones
    .filter((f) => new Date(f.fechaHora) > ahora)
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
    .slice(0, 3);

const PeliculaCard = ({
  id,
  titulo,
  poster_url,
  clasificacion,
  funciones = [],
  verDetalle,
  reservar,
}) => {
  const ahora = new Date();
  const proximas = proximasFunciones(funciones, ahora);

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
        </div>

        <h3 className="pelicula-card_titulo">
          <button type="button" className="pelicula-card_boton-titulo" onClick={() => verDetalle(id)}>
            {titulo}
          </button>
        </h3>

        <div className="pelicula-card_funciones">
          <p className="pelicula-card_rotulo">Próximas funciones</p>
          <div className="pelicula-card_funciones-cuerpo">
            {proximas.length === 0 ? (
              <p className="pelicula-card_sin-funciones">Sin funciones próximas</p>
            ) : (
              <div className="pelicula-card_funciones-grilla">
                {proximas.map((f) => {
                  const fecha = new Date(f.fechaHora);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`pelicula-card_funcion${f.premium ? ' pelicula-card_funcion--vip' : ''}`}
                      title={f.sala}
                      disabled={!f.disponible}
                      onClick={() => reservar(f)}
                    >
                      <span className="pelicula-card_dia">{etiquetaDia(fecha, ahora)}</span>
                      <span className="pelicula-card_hora">
                        {dosDigitos(fecha.getHours())}:{dosDigitos(fecha.getMinutes())}
                      </span>
                      <span className="pelicula-card_idioma">
                        {f.idioma}
                        {f.premium && ' · VIP'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PeliculaCard;
