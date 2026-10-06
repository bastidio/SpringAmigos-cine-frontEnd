import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PeliculaFicha from './PeliculaFicha';
import FuncionCard from './FuncionCard';
import './Detalle.css';

// Componente padre del detalle: tiene el estado y la logica. Le pide al
// backend la pelicula y las funciones, y se las pasa a los hijos por props.
const PeliculaDetalle = () => {
  // useParams devuelve un objeto con los parametros de la URL. En App la ruta
  // es "/pelicula/:id", asi que en "/pelicula/3" el id vale "3".
  const { id } = useParams();

  const [pelicula, setPelicula] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [error, setError] = useState(null);

  // Efecto secundario: pedirle los datos al back. En el array de dependencias
  // va id: se ejecuta al montar el componente y cada vez que cambie el id.
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

  // Primero "por las malas": error y cargando.
  if (error !== null) {
    return <p className="pagina__mensaje pagina__mensaje--error">{error}</p>;
  }

  if (pelicula === null) {
    return <p className="pagina__mensaje">Cargando película...</p>;
  }

  // De todas las funciones, me quedo con las de esta pelicula y las ordeno
  // por horario. filter devuelve un array nuevo, asi que sort ordena esa
  // copia y el estado funciones no se toca.
  const funcionesDeLaPelicula = funciones
    .filter((funcion) => funcion.pelicula.id === pelicula.id)
    .sort((a, b) => (a.horario > b.horario ? 1 : -1));

  // Dias que tienen funciones, sin repetir.
  // El horario llega como "2026-10-21T14:30:00"; slice(0, 10) es "2026-10-21".
  const dias = [...new Set(funcionesDeLaPelicula.map((funcion) => funcion.horario.slice(0, 10)))];

  return (
    <div className="detalle">
      <div className="detalle__fondo">
        {pelicula.poster_url && <img src={pelicula.poster_url} alt="" />}
      </div>

      <div className="detalle__contenido">
        <PeliculaFicha pelicula={pelicula} />

        <hr className="detalle__separador" />

        <h2 className="detalle__funciones-titulo">Funciones disponibles</h2>

        {funcionesDeLaPelicula.length === 0 && (
          <p className="pagina__mensaje">Todavía no hay funciones para esta película.</p>
        )}

        {dias.map((dia) => {
          // De las funciones de la pelicula, las de este dia.
          const funcionesDelDia = funcionesDeLaPelicula.filter(
            (funcion) => funcion.horario.slice(0, 10) === dia,
          );

          return (
            <div key={dia} className="detalle__dia">
              <h3 className="detalle__dia-titulo">
                {dia.slice(8, 10)}/{dia.slice(5, 7)}
              </h3>

              <div className="detalle__funciones">
                {funcionesDelDia.map((funcion) => (
                  <FuncionCard
                    key={funcion.id}
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
