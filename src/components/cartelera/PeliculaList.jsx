import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPeliculas, fetchFunciones } from '../../redux/carteleraSlice';
import CarruselDestacadas from './CarruselDestacadas';
import PeliculaCard from './PeliculaCard';
import Filtro from './Filtro';
import './Cartelera.css';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dosDigitos = (n) => String(n).padStart(2, '0');

const etiquetaDia = (fecha, ahora) => {
  const inicioDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dias = Math.round((inicioDia(fecha) - inicioDia(ahora)) / 86400000);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  return `${DIAS[fecha.getDay()]} ${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}`;
};

// Las 3 próximas funciones de una película, ya listas para mostrar en la tarjeta.
const proximasFunciones = (funciones, peliculaId, ahora) =>
  funciones
    .filter((f) => f.pelicula.id === peliculaId && new Date(f.horario) > ahora)
    .sort((a, b) => new Date(a.horario) - new Date(b.horario))
    .slice(0, 3)
    .map((f) => {
      const fecha = new Date(f.horario);
      return {
        id: f.id,
        dia: etiquetaDia(fecha, ahora),
        hora: `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`,
        idioma: /sub/i.test(f.idioma) ? 'Sub' : 'Dob',
        disponible: f.entradasVendidas < f.sala.capacidad,
        sala: f.sala.nombre,
        premium: /premium|vip/i.test(f.sala.nombre),
      };
    });

const PeliculaList = () => {
  const dispatch = useDispatch();
  const { peliculas, funciones, loading, error } = useSelector((state) => state.cartelera);
  const [clasificacion, setClasificacion] = useState('Todos');
  const [idioma, setIdioma] = useState('Todos');

  const navigate = useNavigate();

  // Montaje: pide películas y funciones. Desmontaje: cancela los pedidos en curso.
  useEffect(() => {
    const pedidoPeliculas = dispatch(fetchPeliculas());
    const pedidoFunciones = dispatch(fetchFunciones());
    return () => {
      pedidoPeliculas.abort();
      pedidoFunciones.abort();
    };
  }, [dispatch]);

  const verDetalle = (id) => {
    navigate(`/pelicula/${id}`);
  };

  const reservar = (funcionId) => {
    navigate(`/funcion/${funcionId}/butacas`);
  };

  if (loading) {
    return <p className="pagina_mensaje">Cargando cartelera...</p>;
  }

  if (error) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudo cargar la cartelera: {error}
      </p>
    );
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

  const ahora = new Date();

  return (
    <>
      <CarruselDestacadas peliculas={peliculas.slice(0, 5)} />

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
                clasificacion={pelicula.clasificacion}
                funciones={proximasFunciones(funciones, pelicula.id, ahora)}
                verDetalle={verDetalle}
                reservar={reservar}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PeliculaList;
