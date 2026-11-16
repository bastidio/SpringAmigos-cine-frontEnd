import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisEntradas } from '../../redux/ordenesSlice';
import EntradaCard from './EntradaCard';
import './Entradas.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

const formatoFecha = (horario) => {
  if (!horario) return 'Fecha no disponible';
  const dia = horario.slice(8, 10) + '/' + horario.slice(5, 7) + '/' + horario.slice(0, 4);
  const hora = horario.slice(11, 16);
  return dia + ' - ' + hora + ' hs';
};

const HistorialEntradas = () => {
  const dispatch = useDispatch();
  const { misEntradas: entradas, loading: cargando, error } = useSelector((state) => state.ordenes);

  const cargarEntradas = () => {
    dispatch(fetchMisEntradas());
  };

  useEffect(() => {
    dispatch(fetchMisEntradas());
  }, [dispatch]);

  if (cargando) {
    return <p className="pagina_mensaje">Cargando historial de entradas...</p>;
  }

  if (error !== null) {
    return (
      <div className="entradas">
        <p role="alert" className="pagina_mensaje pagina_mensaje--error">
          No se pudo cargar tu historial.
        </p>
        <button
          type="button"
          className="boton boton--secundario entradas__reintentar"
          onClick={cargarEntradas}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="entradas">
      <div className="entradas__encabezado">
        <div>
          <h1 className="entradas__titulo">Mis Entradas</h1>
          <p className="entradas__bajada">Historial de compras y tickets confirmados</p>
        </div>
        <Link className="boton boton--primario" to="/">
          + Nueva compra
        </Link>
      </div>

      {entradas.length === 0 ? (
        <div className="entradas__vacio">
          <span className="etiqueta">Sin tickets</span>
          <h2 className="entradas__vacio-titulo">Todavía no tenés entradas</h2>
          <p className="entradas__vacio-texto">
            Cuando completes una compra, tus tickets aparecerán acá.
          </p>
          <Link className="boton boton--secundario" to="/carrito">
            Ir al carrito
          </Link>
        </div>
      ) : (
        <>
          <p className="entradas__contador">
            {entradas.length}{' '}
            {entradas.length === 1 ? 'entrada encontrada' : 'entradas encontradas'}
          </p>

          <div className="entradas__grilla">
            {entradas.map((entrada) => (
              <EntradaCard
                key={entrada.id}
                entrada={entrada}
                formatearFecha={formatoFecha}
                formatearMoneda={moneda}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialEntradas;
