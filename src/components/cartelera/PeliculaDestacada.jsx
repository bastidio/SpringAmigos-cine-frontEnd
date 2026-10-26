

const PeliculaDestacada = ({ pelicula, verDetalle }) => {
  return (
    <section className="destacada">
      {pelicula.poster_url && (
        <img className="destacada_fondo" src={pelicula.poster_url} alt="" />
      )}

      <div className="destacada_contenido">
        <div className="destacada_texto">
          <h1 className="destacada_titulo">{pelicula.titulo}</h1>

          <p className="destacada_datos">
            <span className="etiqueta">{pelicula.clasificacion}</span>
            <span>{pelicula.duracion} min</span>
            <span>{pelicula.idioma}</span>
          </p>

          <p className="destacada_sinopsis">{pelicula.sinopsis}</p>

          <div className="destacada_botones">
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
