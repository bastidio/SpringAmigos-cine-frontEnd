import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PeliculaDestacada from './PeliculaDestacada';
import PeliculaCard from './PeliculaCard';
import Filtro from './Filtro';
import './Cartelera.css';

// Componente padre de la cartelera: es el unico que tiene estado y logica.
// Le pide las peliculas al backend, las guarda en un estado local y se las
// pasa a los hijos por props.
const PeliculaList = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [clasificacion, setClasificacion] = useState('Todos');
  const [idioma, setIdioma] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Pedirle datos al back es un efecto secundario: va adentro de un useEffect.
  // Array de dependencias vacio: se ejecuta una sola vez, cuando el componente
  // se monta. GET /peliculas es publico (no necesita token); la ruta la reenvia
  // el proxy de Vite al backend (ver vite.config.js).
  useEffect(() => {
    fetch('/peliculas')
      .then((response) => {
        // fetch solo rechaza la promesa si falla la conexion. Si el back
        // responde con un error (404, 500...), hay que mandarlo al catch a mano.
        if (!response.ok) {
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setPeliculas(data);
        setError(null);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al mostrar la cartelera', error);
        setError('No se pudo cargar la cartelera. Revisá que el backend esté levantado.');
        setCargando(false);
      });
  }, []);

  // El click ocurre en la card (hijo), pero la logica vive aca (padre).
  // Como es un boton, para cambiar de vista se usa useNavigate.
  const verDetalle = (id) => {
    navigate(`/pelicula/${id}`);
  };

  // Primero "por las malas": cargando, error, lista vacia.
  if (cargando) {
    return <p className="pagina__mensaje">Cargando cartelera...</p>;
  }

  if (error !== null) {
    return <p className="pagina__mensaje pagina__mensaje--error">{error}</p>;
  }

  if (peliculas.length === 0) {
    return <p className="pagina__mensaje">Todavía no hay películas en cartelera.</p>;
  }

  // Opciones de los filtros: salen de las peliculas que mando el back.
  // Set no admite repetidos, asi cada clasificacion/idioma aparece una sola vez.
  const clasificaciones = [...new Set(peliculas.map((p) => p.clasificacion))];
  const idiomas = [...new Set(peliculas.map((p) => p.idioma))];

  // filter devuelve un array nuevo: el estado peliculas no se toca.
  const visibles = peliculas.filter((p) => {
    if (clasificacion !== 'Todos' && p.clasificacion !== clasificacion) {
      return false;
    }
    if (idioma !== 'Todos' && p.idioma !== idioma) {
      return false;
    }
    return true;
  });

  return (
    <>
      <PeliculaDestacada pelicula={peliculas[0]} verDetalle={verDetalle} />

      <div className="cartelera__contenido">
        <div className="cartelera__encabezado">
          <div>
            <h2 className="cartelera__titulo">En cartelera</h2>
            <p className="cartelera__cantidad">{visibles.length} películas disponibles</p>
          </div>

          <div className="cartelera__filtros">
            <Filtro
              etiqueta="Clasificación"
              valor={clasificacion}
              opciones={clasificaciones}
              cambiar={setClasificacion}
            />
            <Filtro etiqueta="Idioma" valor={idioma} opciones={idiomas} cambiar={setIdioma} />
          </div>
        </div>

        {visibles.length === 0 ? (
          <p className="cartelera__sin-resultados">No hay películas con esos filtros.</p>
        ) : (
          <div className="cartelera__grid">
            {visibles.map((pelicula) => (
              <PeliculaCard
                key={pelicula.id}
                id={pelicula.id}
                titulo={pelicula.titulo}
                poster_url={pelicula.poster_url}
                duracion={pelicula.duracion}
                clasificacion={pelicula.clasificacion}
                idioma={pelicula.idioma}
                verDetalle={verDetalle}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PeliculaList;
