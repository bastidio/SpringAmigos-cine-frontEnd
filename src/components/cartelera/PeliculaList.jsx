import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarruselDestacadas from './CarruselDestacadas';
import PeliculaCard from './PeliculaCard';
import Filtro from './Filtro';
import './Cartelera.css';




const PeliculaList = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [clasificacion, setClasificacion] = useState('Todos');
  const [idioma, setIdioma] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  
  
  
  
  useEffect(() => {
    fetch('/peliculas')
      .then((response) => {
        
        
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

  
  
  const verDetalle = (id) => {
    navigate(`/pelicula/${id}`);
  };

  
  if (cargando) {
    return <p className="pagina_mensaje">Cargando cartelera...</p>;
  }

  if (error !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{error}</p>;
  }

  if (peliculas.length === 0) {
    return <p className="pagina_mensaje">Todavía no hay películas en cartelera.</p>;
  }

  
  
  const clasificaciones = [...new Set(peliculas.map((p) => p.clasificacion))];
  const idiomas = [...new Set(peliculas.map((p) => p.idioma))];

  
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
      {}
      <CarruselDestacadas peliculas={peliculas.slice(0, 5)} verDetalle={verDetalle} />

      <div className="cartelera_contenido">
        <div className="cartelera_encabezado">
          <div>
            <h2 className="cartelera_titulo">En cartelera</h2>
            <p className="cartelera_cantidad">{visibles.length} películas disponibles</p>
          </div>

          <div className="cartelera_filtros">
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
          <p className="cartelera_sin-resultados">No hay películas con esos filtros.</p>
        ) : (
          <div className="cartelera_grid">
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
