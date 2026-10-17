import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
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

  const fecha = new Date(horario);
  if (Number.isNaN(fecha.getTime())) return horario;

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(fecha);
};

const HistorialEntradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarEntradas = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await apiFetch('/entradas/mis-entradas');
      setEntradas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar tu historial.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    apiFetch('/entradas/mis-entradas')
      .then((data) => {
        if (activo) {
          setEntradas(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || 'No se pudo cargar tu historial.');
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return <p className="pagina__mensaje">Cargando historial de entradas...</p>;
  }

  if (error !== null) {
    return (
      <div className="entradas">
        <p role="alert" className="pagina__mensaje pagina__mensaje--error">
          {error}
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