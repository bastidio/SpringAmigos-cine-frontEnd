// Componente "tonto": el bloque grande de arriba de la cartelera.
// Muestra una pelicula (la primera de la lista) con su poster de fondo.
const PeliculaDestacada = ({ pelicula, verDetalle }) => {
  return (
    <section className="destacada">
      {pelicula.poster_url && (
        <img className="destacada__fondo" src={pelicula.poster_url} alt="" />
      )}

      <div className="destacada__contenido">
        <div className="destacada__texto">
          <h1 className="destacada__titulo">{pelicula.titulo}</h1>

          <p className="destacada__datos">
            <span className="etiqueta">{pelicula.clasificacion}</span>
            <span>{pelicula.duracion} min</span>
            <span>{pelicula.idioma}</span>
          </p>

          <p className="destacada__sinopsis">{pelicula.sinopsis}</p>

          <div className="destacada__botones">
            <button
              type="button"
              className="boton boton--primario"
              onClick={() => verDetalle(pelicula.id)}
            >
              Ver funciones
            </button>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => verDetalle(pelicula.id)}
            >
              Más información
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeliculaDestacada;
