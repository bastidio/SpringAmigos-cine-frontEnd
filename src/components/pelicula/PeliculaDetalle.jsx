import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPelicula, fetchFunciones } from '../../redux/carteleraSlice';
import PeliculaFicha from './PeliculaFicha';
import FuncionCard from './FuncionCard';
import IconoButaca from '../cartelera/IconoButaca';
import { funcionesFuturas, disponibilidad } from '../cartelera/funcionesPelicula';
import './Detalle.css';



const PeliculaDetalle = () => {
  
  
  const { id } = useParams();
  const irAFunciones = useLocation().hash === '#funciones';

  const dispatch = useDispatch();
  const {
    peliculaSeleccionada: pelicula, funciones, funcionesEstado, loading, error, errorFunciones,
  } = useSelector((state) => state.cartelera);
  const peliculaCargada = pelicula !== null && String(pelicula.id) === id;

  // La película se pide solo si la guardada no es la de este id.
  useEffect(() => {
    if (!peliculaCargada) dispatch(fetchPelicula(id));
  }, [dispatch, id, peliculaCargada]);

  // Las funciones se piden solo si todavía no están.
  useEffect(() => {
    if (funcionesEstado === 'inicial' && errorFunciones === null) dispatch(fetchFunciones());
  }, [dispatch, funcionesEstado, errorFunciones]);

  const cargandoFunciones = funcionesEstado === 'cargando' && funciones.length === 0;

  useEffect(() => {
    if (irAFunciones) return;
    window.scrollTo(0, 0);
  }, [id, irAFunciones]);

  const listo = !loading && !cargandoFunciones && error === null && peliculaCargada;
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
        No se pudo cargar la película. Puede que ya no exista. Intentá de nuevo más tarde.
      </p>
    );
  }

  if (errorFunciones !== null) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudieron cargar las funciones. Intentá de nuevo más tarde.
      </p>
    );
  }

  if (loading || cargandoFunciones || !peliculaCargada) {
    return <p className="pagina_mensaje">Cargando película...</p>;
  }

  // "En cartelera" = tiene alguna función con horario mayor a ahora.
  const ahora = new Date();
  const enCartelera = funcionesFuturas(funciones, pelicula.id, ahora).length > 0;

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

  
  
  
  const funcionesDeLaPelicula = funcionesFuturas(funciones, pelicula.id, ahora)
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

        <div className="detalle_funciones-encabezado">
          <h2 id="funciones" className="detalle_funciones-titulo">Funciones disponibles</h2>
          <p className="detalle_referencia">
            <span className="detalle_referencia-item"><IconoButaca nivel="alta" /> Alta</span>
            <span className="detalle_referencia-item"><IconoButaca nivel="media" /> Media</span>
            <span className="detalle_referencia-item"><IconoButaca nivel="baja" /> Baja</span>
          </p>
        </div>

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
                    disponibilidad={disponibilidad(funcion)}
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
