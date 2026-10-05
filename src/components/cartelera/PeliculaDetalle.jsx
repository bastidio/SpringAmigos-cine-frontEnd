import FuncionCard from './FuncionCard';

// Componente "tonto": muestra todos los datos de la pelicula seleccionada y
// sus funciones. Todo le llega por props desde PeliculaList: el objeto
// pelicula, el array de funciones (ya filtrado) y la funcion volver.
const PeliculaDetalle = ({ pelicula, funciones, volver }) => {
  // Dias que tienen funciones, sin repetir (las funciones ya llegan ordenadas).
  // El horario llega como "2026-10-21T14:30:00"; slice(0, 10) es "2026-10-21".
  const dias = [...new Set(funciones.map((funcion) => funcion.horario.slice(0, 10)))];

  return (
    <section className="detalle">
      <div className="detalle__fondo">
        {pelicula.poster_url && <img src={pelicula.poster_url} alt="" />}
      </div>

      <button type="button" className="boton boton--secundario detalle__volver" onClick={volver}>
        ← Volver a la cartelera
      </button>

      <div className="detalle__contenido">
        <div className="detalle__ficha">
          <div className="detalle__poster">
            {pelicula.poster_url ? (
              <img src={pelicula.poster_url} alt="" />
            ) : (
              <span className="pelicula-card__poster pelicula-card__poster--vacio">Sin póster</span>
            )}
          </div>

          <div className="detalle__info">
            <p className="detalle__etiquetas">
              <span className="etiqueta">{pelicula.clasificacion}</span>
            </p>

            <h1 className="detalle__titulo">{pelicula.titulo}</h1>

            <p className="detalle__resumen">
              <span>{pelicula.duracion} min</span>
              <span>{pelicula.idioma}</span>
            </p>

            <dl className="detalle__datos">
              <div>
                <dt>Idioma</dt>
                <dd>{pelicula.idioma}</dd>
              </div>
              <div>
                <dt>Duración</dt>
                <dd>{pelicula.duracion} min</dd>
              </div>
              <div>
                <dt>Clasificación</dt>
                <dd>{pelicula.clasificacion}</dd>
              </div>
            </dl>

            <p className="detalle__subtitulo">Sinopsis</p>
            <p className="detalle__sinopsis">{pelicula.sinopsis}</p>
          </div>
        </div>

        <hr className="detalle__separador" />

        <h2 className="detalle__funciones-titulo">Funciones disponibles</h2>

        {funciones.length === 0 && (
          <p className="cartelera__mensaje">Todavía no hay funciones para esta película.</p>
        )}

        {dias.map((dia) => {
          // De las funciones de la pelicula, las de este dia.
          const funcionesDelDia = funciones.filter(
            (funcion) => funcion.horario.slice(0, 10) === dia,
          );

          return (
            <div key={dia} className="detalle__dia">
              <h3 className="detalle__dia-titulo">
                {dia.slice(8, 10)}/{dia.slice(5, 7)}
              </h3>

              <div className="detalle__funciones">
                {funcionesDelDia.map((funcion) => (
                  <FuncionCard
                    key={funcion.id}
                    horario={funcion.horario}
                    sala={funcion.sala.nombre}
                    idioma={funcion.idioma}
                    formato={funcion.formato}
                    precio_base={funcion.precio_base}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PeliculaDetalle;
