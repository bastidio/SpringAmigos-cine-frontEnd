import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisEntradas, invalidarMisEntradas } from '../../redux/ordenesSlice';
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

// Caducada: ya pasó el horario más la duración de la película (si no viene la duración, solo el horario).
const estaCaducada = (entrada, ahora) => {
  const fin = new Date(entrada.horario);
  if (entrada.duracion) fin.setMinutes(fin.getMinutes() + entrada.duracion);
  return fin < ahora;
};

const HistorialEntradas = () => {
  const dispatch = useDispatch();
  const { misEntradas: entradas, misEntradasEstado, error } = useSelector((state) => state.ordenes);
  const [solapa, setSolapa] = useState('vigentes');

  // Reintentar: vuelve el estado a "inicial" y el useEffect las pide de nuevo.
  const cargarEntradas = () => {
    dispatch(invalidarMisEntradas());
  };

  useEffect(() => {
    if (misEntradasEstado === 'inicial' && error === null) dispatch(fetchMisEntradas());
  }, [dispatch, misEntradasEstado, error]);

  if (misEntradasEstado === 'cargando' && entradas.length === 0) {
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

  const ahora = new Date();
  const caducadas = entradas.filter((entrada) => estaCaducada(entrada, ahora));
  const vigentes = entradas.filter((entrada) => !estaCaducada(entrada, ahora));
  const visibles = solapa === 'vigentes' ? vigentes : caducadas;

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
          <div className="entradas__solapas">
            <button
              type="button"
              className={solapa === 'vigentes' ? 'tab tab--activa' : 'tab'}
              aria-pressed={solapa === 'vigentes'}
              onClick={() => setSolapa('vigentes')}
            >
              Vigentes ({vigentes.length})
            </button>
            <button
              type="button"
              className={solapa === 'caducadas' ? 'tab tab--activa' : 'tab'}
              aria-pressed={solapa === 'caducadas'}
              onClick={() => setSolapa('caducadas')}
            >
              Caducadas ({caducadas.length})
            </button>
          </div>

          {visibles.length === 0 ? (
            <div className="entradas__vacio">
              <h2 className="entradas__vacio-titulo">
                {solapa === 'vigentes' ? 'No tenés entradas vigentes' : 'No tenés entradas caducadas'}
              </h2>
              <p className="entradas__vacio-texto">
                {solapa === 'vigentes'
                  ? 'Las entradas de funciones que todavía no terminaron aparecen acá.'
                  : 'Las entradas de funciones que ya terminaron aparecen acá.'}
              </p>
            </div>
          ) : (
            <>
              <p className="entradas__contador">
                {visibles.length}{' '}
                {visibles.length === 1 ? 'entrada encontrada' : 'entradas encontradas'}
              </p>

              <div className="entradas__grilla">
                {visibles.map((entrada) => (
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
        </>
      )}
    </div>
  );
};

export default HistorialEntradas;
