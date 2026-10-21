import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import CarritoItem from './CarritoItem';
import PanelResumenCarrito from './PanelResumenCarrito';
import './Carrito.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

const CarritoDetalle = () => {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarCarrito = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await apiFetch('/api/carritos');
      setCarrito(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el carrito.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    apiFetch('/api/carritos')
      .then((data) => {
        if (activo) {
          setCarrito(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || 'No se pudo cargar el carrito.');
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
    return <p className="pagina_mensaje">Cargando carrito...</p>;
  }

  if (error !== null) {
    return (
      <div className="carrito">
        <p role="alert" className="pagina_mensaje pagina_mensaje--error">
          {error}
        </p>
        <button
          type="button"
          className="boton boton--secundario carrito__reintentar"
          onClick={cargarCarrito}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const items = carrito?.items ?? [];
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="carrito">
      <Link to="/" className="carrito__volver">
        ← Seguir comprando
      </Link>

      <div className="carrito__encabezado">
        <div>
          <h1 className="carrito__titulo">Carrito</h1>
          <p className="carrito__bajada">Revisá los artículos antes de continuar.</p>
        </div>
        {cantidadTotal > 0 && (
          <span className="etiqueta etiqueta--dorada carrito__badge">
            {cantidadTotal} {cantidadTotal === 1 ? 'artículo' : 'artículos'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="carrito__vacio">
          <span className="etiqueta">Carrito vacío</span>
          <h2 className="carrito__vacio-titulo">Tu carrito está vacío</h2>
          <p className="carrito__vacio-texto">
            Elegí una película en la cartelera o agregá productos del kiosco para comenzar.
          </p>
          <Link className="boton boton--primario" to="/">
            Ver cartelera
          </Link>
        </div>
      ) : (
        <div className="carrito__cuerpo">
          <div className="carrito__lista">
            {items.map((item) => (
              <CarritoItem key={item.itemId} item={item} formatearMoneda={moneda} />
            ))}
          </div>

          <PanelResumenCarrito
            cantidadArticulos={cantidadTotal}
            total={carrito.total}
            formatearMoneda={moneda}
          />
        </div>
      )}
    </div>
  );
};

export default CarritoDetalle;