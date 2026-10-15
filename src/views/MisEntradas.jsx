import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Compras.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

function formatoFecha(horario) {
  if (!horario) return 'Fecha no disponible';

  const fecha = new Date(horario);

  if (Number.isNaN(fecha.getTime())) return horario;

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(fecha);
}

function MisEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarEntradas = useCallback(async () => {
    setCargando(true);
    setError('');

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
        if (activo) setEntradas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudo cargar tu historial.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <section className="pagina compras">
      <div className="compras__encabezado compras__encabezado--entradas">
        <div>
          <h1 className="compras__titulo">Mis Entradas</h1>
          <p className="compras__subtitulo">Historial de compras y tickets</p>
        </div>
        <Link className="boton boton--primario" to="/carrito">+ Nueva compra</Link>
      </div>

      {cargando && (
        <p className="pagina__mensaje">Cargando historial de entradas...</p>
      )}

      {!cargando && error && (
        <div>
          <p role="alert" className="compras__error">{error}</p>
          <button
            type="button"
            className="boton boton--secundario"
            onClick={cargarEntradas}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && entradas.length === 0 && (
        <div className="compras__vacio compras__vacio--entradas">
          <span className="compras__icono" aria-hidden="true">▤</span>
          <h2>Todavía no tenés entradas</h2>
          <p>Cuando completes una compra, tus tickets aparecerán acá.</p>
          <Link className="boton boton--secundario" to="/carrito">Ir al carrito</Link>
        </div>
      )}

      {!cargando && !error && entradas.length > 0 && (
        <>
          <p className="entradas__contador">
            {entradas.length}{' '}
            {entradas.length === 1 ? 'entrada encontrada' : 'entradas encontradas'}
          </p>

          <div className="entradas__lista">
            {entradas.map((entrada) => (
              <article className="entrada-ticket" key={entrada.id}>
                <div className="entrada-ticket__cabecera">
                  <span className="entrada-ticket__estado">Confirmada</span>
                  <span>{formatoFecha(entrada.horario)}</span>
                </div>

                <div className="entrada-ticket__contenido">
                  <h2>{entrada.pelicula}</h2>
                  <p className="entrada-ticket__fecha">Sala {entrada.sala || '—'}</p>
                </div>

                <div className="entrada-ticket__datos">
                  <div>
                    <span>Butaca</span>
                    <strong>{entrada.fila ?? '—'}{entrada.numero ?? ''}</strong>
                  </div>
                  <div>
                    <span>Entrada</span>
                    <strong>#{entrada.id}</strong>
                  </div>
                  <div className="entrada-ticket__precio">
                    <span>Total</span>
                    <strong>{moneda(entrada.precio)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default MisEntradas;