// Componente "tonto": no tiene estado ni logica. Recibe por props los datos
// de UNA pelicula y los maqueta. PeliculaList lo renderiza una vez por pelicula.
// Toda la tarjeta es un boton: el click ocurre aca, pero lo que pasa lo decide
// el padre, porque verDetalle es una funcion que llega por props.
const PeliculaCard = ({ id, titulo, poster_url, duracion, clasificacion, idioma, verDetalle }) => {
  return (
    <button type="button" className="pelicula-card" onClick={() => verDetalle(id)}>
      <span className="pelicula-card_marco">
        {poster_url ? (
          <img className="pelicula-card_poster" src={poster_url} alt="" />
        ) : (
          <span className="pelicula-card_poster sin-imagen">Sin póster</span>
        )}
        <span className="etiqueta etiqueta--sobre-imagen pelicula-card_clasificacion">{clasificacion}</span>
      </span>
      <span className="pelicula-card_titulo">{titulo}</span>
      <span className="pelicula-card_datos">
        {duracion} min · {idioma}
      </span>
    </button>
  );
};

export default PeliculaCard;
