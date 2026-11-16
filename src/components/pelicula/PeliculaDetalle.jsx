import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPelicula, fetchFunciones } from '../../redux/carteleraSlice';
import PeliculaFicha from './PeliculaFicha';
import FuncionCard from './FuncionCard';
import './Detalle.css';



const PeliculaDetalle = () => {
  
  
  const { id } = useParams();
  const irAFunciones = useLocation().hash === '#funciones';

  const dispatch = useDispatch();
  const { peliculaSeleccionada: pelicula, funciones, loading, error } = useSelector((state) => state.cartelera);
  const [errorFunciones, setErrorFunciones] = useState(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      const res = await dispatch(fetchPelicula(id));
      if (res.error) return;
      const resFunciones = await dispatch(fetchFunciones());
      setErrorFunciones(resFunciones.error ? 'No se pudieron cargar las funciones. Revisá que el backend esté levantado.' : null);
    };
    cargarDetalle();
  }, [dispatch, id]);

  useEffect(() => {
    if (irAFunciones) return;
    window.scrollTo(0, 0);
  }, [id, irAFunciones]);

  const listo = !loading && error === null && pelicula !== null && String(pelicula.id) === id;
  useEffect(() => {
    if (!irAFunciones || !listo) return;
    const titulo = document.getElementById('funciones');
    if (titulo === null) return;
    let distancia = 0;
    let elemento = titulo;
    while (elemento !== null) {
      distancia += elemento.offsetTop;
      elemento = elemento.offsetParent;
    }
    window.scrollTo(0, distancia - 88);
  }, [irAFunciones, listo]);

  
  if (error !== null) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudo cargar la película. Puede que no exista o que el backend esté caído.
      </p>
    );
  }

  if (errorFunciones !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{errorFunciones}</p>;
  }

  if (loading || pelicula === null || String(pelicula.id) !== id) {
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

        <h2 id="funciones" className="detalle_funciones-titulo">Funciones disponibles</h2>

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
