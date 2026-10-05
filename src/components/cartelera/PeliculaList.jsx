import { useEffect, useState } from 'react';
import PeliculaDestacada from './PeliculaDestacada';
import PeliculaCard from './PeliculaCard';
import PeliculaDetalle from './PeliculaDetalle';
import Filtro from './Filtro';
import './Cartelera.css';

// Componente padre de la cartelera: es el unico que tiene estado y logica.
// Le pide los datos al backend, los guarda, y se los pasa a los hijos por props.
const PeliculaList = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [clasificacion, setClasificacion] = useState('Todos');
  const [idioma, setIdioma] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se ejecuta una sola vez, cuando el componente aparece en pantalla.
  // GET /peliculas y GET /funciones son publicos (no necesitan token). Las
  // rutas las reenvia el proxy de Vite al backend (ver vite.config.js).
  useEffect(() => {
    fetch('/peliculas')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('El backend respondió con error');
        }
        return respuesta.json();
      })
      .then((data) => {
        setPeliculas(data);
        setCargando(false);
      })
      .catch(() => {
        setError('No se pudo cargar la cartelera. Revisá que el backend esté levantado.');
        setCargando(false);
      });

    fetch('/funciones')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('El backend respondió con error');
        }
        return respuesta.json();
      })
      .then((data) => {
        setFunciones(data);
      })
      .catch(() => {
        setError('No se pudo cargar la cartelera. Revisá que el backend esté levantado.');
      });
  }, []);

  // El click ocurre en la card (hijo), pero la logica vive aca (padre),
  // porque este componente es el que tiene el estado.
  const verDetalle = (id) => {
    const pelicula = peliculas.find((p) => p.id === id);
    setSeleccionada(pelicula);
  };

  const volver = () => {
    setSeleccionada(null);
  };

  // Primero "por las malas": cargando, error, lista vacia.
  if (cargando) {
    return <p className="cartelera__mensaje">Cargando cartelera...</p>;
  }

  if (error !== null) {
    return <p className="cartelera__mensaje cartelera__mensaje--error">{error}</p>;
  }

  if (peliculas.length === 0) {
    return <p className="cartelera__mensaje">Todavía no hay películas en cartelera.</p>;
  }

  // Detalle: de todas las funciones, me quedo con las de la pelicula elegida
  // y las ordeno por horario. filter devuelve un array nuevo, asi que sort
  // ordena esa copia y el estado funciones no se toca.
  if (seleccionada !== null) {
    const funcionesDeLaPelicula = funciones
      .filter((funcion) => funcion.pelicula.id === seleccionada.id)
      .sort((a, b) => (a.horario > b.horario ? 1 : -1));

    return (
      <PeliculaDetalle
        pelicula={seleccionada}
        funciones={funcionesDeLaPelicula}
        volver={volver}
      />
    );
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
