import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import PeliculaFicha from './PeliculaFicha';
import FuncionCard from './FuncionCard';
import './Detalle.css';



const PeliculaDetalle = () => {
  
  
  const { id } = useParams();
  const irAFunciones = useLocation().hash === '#funciones';

  const [pelicula, setPelicula] = useState(null);
  const [funciones, setFunciones] = useState(null);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/peliculas/${id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setPelicula(data);
        setError(null);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Error al mostrar la película', error);
        setError('No se pudo cargar la película. Puede que no exista o que el backend esté caído.');
      });

    fetch('/funciones', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setFunciones(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Error al mostrar las funciones', error);
        setError('No se pudieron cargar las funciones. Revisá que el backend esté levantado.');
      });

    return () => controller.abort();
  }, [id]);

  // Si se entra con #funciones (boton "Ver funciones" del banner) no se va arriba:
  // el scroll a la seccion lo hace irAFunciones cuando el titulo ya existe.
  useEffect(() => {
    if (irAFunciones) return;
    window.scrollTo(0, 0);
  }, [id, irAFunciones]);

  // Callback ref: React lo llama con el elemento cuando el titulo se monta en pantalla
  // (recien despues de que cargaron las funciones, antes ese titulo no existe) y con null
  // cuando se desmonta. useCallback mantiene la misma funcion entre renders, asi no se
  // vuelve a llamar (ni a hacer scroll) en cada render.
  const irAFuncionesRef = useCallback(
    (titulo) => {
      if (titulo === null || !irAFunciones) return;
      const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      titulo.scrollIntoView({ behavior: sinAnimacion ? 'auto' : 'smooth' });
    },
    [irAFunciones],
  );

  
  if (error !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{error}</p>;
  }

  if (pelicula === null) {
    return <p className="pagina_mensaje">Cargando película...</p>;
  }

  // Las funciones todavia no llegaron: no se sabe si esta en cartelera.
  if (funciones === null) {
    return <p className="pagina_mensaje">Cargando película...</p>;
  }

  // "En cartelera" = tiene alguna funcion con horario mayor a ahora.
  const ahora = new Date();
  const enCartelera = funciones.some(
    (funcion) => funcion.pelicula.id === pelicula.id && new Date(funcion.horario) > ahora,
  );

  if (!enCartelera) {
    return (
      <div className="detalle_no-cartelera">
        <p className="pagina_mensaje">Esta película no está en cartelera</p>
        <Link to="/" className="boton boton--primario">
          Volver a la cartelera
        </Link>
      </div>
    );
  }

  
  
  
  const funcionesDeLaPelicula = funciones
    .filter((funcion) => funcion.pelicula.id === pelicula.id)
    .sort((a, b) => (a.horario > b.horario ? 1 : -1));

  
  
  const dias = [...new Set(funcionesDeLaPelicula.map((funcion) => funcion.horario.slice(0, 10)))];

  return (
    <div className="detalle">
      <div className={`detalle_fondo${pelicula.bannerUrl ? '' : ' detalle_fondo--poster'}`}>
        {(pelicula.bannerUrl || pelicula.poster_url) && (
          <img src={pelicula.bannerUrl || pelicula.poster_url} alt="" />
        )}
      </div>

      {}
      <Link to="/" className="detalle_volver">
        ← Volver a la cartelera
      </Link>

      <div className="detalle_contenido">
        <PeliculaFicha pelicula={pelicula} />

        <hr className="detalle_separador" />

        <h2 ref={irAFuncionesRef} className="detalle_funciones-titulo">Funciones disponibles</h2>

        {funcionesDeLaPelicula.length === 0 && (
          <p className="pagina_mensaje">Todavía no hay funciones para esta película.</p>
        )}

        {dias.map((dia) => {
          
          const funcionesDelDia = funcionesDeLaPelicula.filter(
            (funcion) => funcion.horario.slice(0, 10) === dia,
          );

          return (
            <div key={dia} className="detalle_dia">
              <h3 className="detalle_dia-titulo">
                {dia.slice(8, 10)}/{dia.slice(5, 7)}
              </h3>

              <div className="detalle_funciones">
                {funcionesDelDia.map((funcion) => (
                  <FuncionCard
                    key={funcion.id}
                    id={funcion.id}
                    horario={funcion.horario}
                    sala={funcion.sala.nombre}
                    idioma={funcion.idioma}
                    formato={funcion.formato}
                    precio_base={funcion.precio_base}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeliculaDetalle;
