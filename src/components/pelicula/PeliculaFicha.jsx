// Componente "tonto": la ficha de una pelicula (poster y datos).
// Recibe el objeto pelicula por props y lo muestra.
const PeliculaFicha = ({ pelicula }) => {
  return (
    <div className="detalle_ficha">
      <div className="detalle_poster">
        {pelicula.poster_url ? (
          <img src={pelicula.poster_url} alt="" />
        ) : (
          <span className="detalle_sin-poster sin-imagen">Sin póster</span>
        )}
      </div>

      <div className="detalle_info">
        <p className="detalle_etiquetas">
          <span className="etiqueta">{pelicula.clasificacion}</span>
        </p>

        <h1 className="detalle_titulo">{pelicula.titulo}</h1>

        <p className="detalle_resumen">
          <span>{pelicula.duracion} min</span>
          <span>{pelicula.idioma}</span>
        </p>

        <dl className="detalle_datos">
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

        <p className="detalle_subtitulo">Sinopsis</p>
        <p className="detalle_sinopsis">{pelicula.sinopsis}</p>
      </div>
    </div>
  );
};

export default PeliculaFicha;
