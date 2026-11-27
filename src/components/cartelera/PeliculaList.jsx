import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPeliculas, fetchFunciones } from '../../redux/carteleraSlice';
import CarruselDestacadas from './CarruselDestacadas';
import GrillaPeliculas from './GrillaPeliculas';
import SeccionPeliculas from './SeccionPeliculas';
import BannerVip from './BannerVip';
import Filtro from './Filtro';
import { textoEstreno, tieneFuncionVip } from './funcionesPelicula';
import './Cartelera.css';

const PeliculaList = () => {
  const dispatch = useDispatch();
  const {
    peliculas, peliculasEstado, funciones, funcionesEstado, error, errorFunciones,
  } = useSelector((state) => state.cartelera);
  const [clasificacion, setClasificacion] = useState('Todos');
  const [idioma, setIdioma] = useState('Todos');

  const navigate = useNavigate();
  useEffect(() => {
    if (peliculasEstado === 'inicial' && error === null) dispatch(fetchPeliculas());
  }, [dispatch, peliculasEstado, error]);

  useEffect(() => {
    if (funcionesEstado === 'inicial' && errorFunciones === null) dispatch(fetchFunciones());
  }, [dispatch, funcionesEstado, errorFunciones]);

  const verDetalle = (id) => {
    navigate(`/pelicula/${id}`);
  };

  const reservar = (funcionId) => {
    navigate(`/funcion/${funcionId}/butacas`);
  };

  if (
    (peliculasEstado === 'cargando' && peliculas.length === 0) ||
    (funcionesEstado === 'cargando' && funciones.length === 0)
  ) {
    return <p className="pagina_mensaje">Cargando cartelera...</p>;
  }

  if (error) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudo cargar la cartelera. Intentá de nuevo más tarde.
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
  const peliculasVip = peliculas.filter((p) => tieneFuncionVip(funciones, p.id, ahora));
  const estreno = (id) => textoEstreno(funciones, id, ahora);
  const proximosEstrenos = peliculas.filter((p) => estreno(p.id));
  const datosGrilla = { funciones, ahora, verDetalle, reservar };

  return (
    <>
      <CarruselDestacadas peliculas={peliculas.slice(0, 5)} />

      <div className="cartelera_contenido">
        <SeccionPeliculas
          titulo="Películas VIP"
          subtitulo="Viví la película con la máxima comodidad"
          peliculas={peliculasVip}
          soloVip
          {...datosGrilla}
        />

        <BannerVip />

        <SeccionPeliculas
          titulo="Próximos estrenos"
          peliculas={proximosEstrenos}
          estreno={estreno}
          {...datosGrilla}
        />

        <section className="cartelera_seccion">
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
            <GrillaPeliculas peliculas={visibles} {...datosGrilla} />
          )}
        </section>
      </div>
    </>
  );
};

export default PeliculaList;
