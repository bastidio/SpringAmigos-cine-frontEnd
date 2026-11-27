import GrillaPeliculas from './GrillaPeliculas';

// Sección sin filtros de la cartelera. Si no tiene películas, no se muestra.
const SeccionPeliculas = ({ titulo, subtitulo, ...grilla }) => {
  if (grilla.peliculas.length === 0) return null;

  return (
    <section className="cartelera_seccion">
      <div className="cartelera_encabezado">
        <div>
          <h2 className="cartelera_titulo">{titulo}</h2>
          {subtitulo && <p className="cartelera_cantidad">{subtitulo}</p>}
        </div>
      </div>
      <GrillaPeliculas {...grilla} />
    </section>
  );
};

export default SeccionPeliculas;
