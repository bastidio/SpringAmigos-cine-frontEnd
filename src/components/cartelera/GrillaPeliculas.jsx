import PeliculaCard from './PeliculaCard';
import { proximasFunciones } from './funcionesPelicula';

const GrillaPeliculas = ({ peliculas, funciones, ahora, verDetalle, reservar, estreno, soloVip }) => (
  <div className="cartelera_grid">
    {peliculas.map((pelicula) => (
      <PeliculaCard
        key={pelicula.id}
        id={pelicula.id}
        titulo={pelicula.titulo}
        poster_url={pelicula.poster_url}
        clasificacion={pelicula.clasificacion}
        funciones={proximasFunciones(funciones, pelicula.id, ahora, soloVip)}
        estreno={estreno?.(pelicula.id)}
        verDetalle={verDetalle}
        reservar={reservar}
      />
    ))}
  </div>
);

export default GrillaPeliculas;
