// Componente "tonto": la ficha de una pelicula (poster y datos).
// Recibe el objeto pelicula por props y lo muestra.
const PeliculaFicha = ({ pelicula }) => {
  return (
    <div className="detalle__ficha">
      <div className="detalle__poster">
        {pelicula.poster_url ? (
          <img src={pelicula.poster_url} alt="" />
        ) : (
          <span className="detalle__sin-poster sin-imagen">Sin póster</span>
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
  );
};

export default PeliculaFicha;
