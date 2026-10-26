import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PeliculaFicha from './PeliculaFicha';
import FuncionCard from './FuncionCard';
import './Detalle.css';



const PeliculaDetalle = () => {
  
  
  const { id } = useParams();

  const [pelicula, setPelicula] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    fetch(`/peliculas/${id}`)
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
        console.error('Error al mostrar la película', error);
        setError('No se pudo cargar la película. Puede que no exista o que el backend esté caído.');
      });

    fetch('/funciones')
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
        console.error('Error al mostrar las funciones', error);
        setError('No se pudieron cargar las funciones. Revisá que el backend esté levantado.');
      });
  }, [id]);

  
  if (error !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{error}</p>;
  }

  if (pelicula === null) {
    return <p className="pagina_mensaje">Cargando película...</p>;
  }

  
  
  
  const funcionesDeLaPelicula = funciones
    .filter((funcion) => funcion.pelicula.id === pelicula.id)
    .sort((a, b) => (a.horario > b.horario ? 1 : -1));

  
  
  const dias = [...new Set(funcionesDeLaPelicula.map((funcion) => funcion.horario.slice(0, 10)))];

  return (
    <div className="detalle">
      <div className="detalle_fondo">
        {pelicula.poster_url && <img src={pelicula.poster_url} alt="" />}
      </div>

      {}
      <Link to="/" className="detalle_volver">
        ← Volver a la cartelera
      </Link>

      <div className="detalle_contenido">
        <PeliculaFicha pelicula={pelicula} />

        <hr className="detalle_separador" />

        <h2 className="detalle_funciones-titulo">Funciones disponibles</h2>

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
