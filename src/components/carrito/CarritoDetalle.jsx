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
  // Error de una accion (quitar, cambiar cantidad, vaciar): se muestra arriba
  // de la lista sin tapar el carrito.
  const [errorAccion, setErrorAccion] = useState(null);
  const [ocupado, setOcupado] = useState(false);

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

  // Despues de cada cambio se vuelve a pedir el carrito: el back responde con
  // la entidad Carrito, que no trae los items ni el total.
  const ejecutarAccion = async (accion) => {
    setOcupado(true);
    setErrorAccion(null);
    try {
      await accion();
    } catch (err) {
      setErrorAccion(err.message);
    }
    try {
      setCarrito(await apiFetch('/api/carritos'));
    } catch (err) {
      setErrorAccion(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const quitarItem = (item) =>
    ejecutarAccion(() => apiFetch(`/api/carritos/items/${item.itemId}`, { method: 'DELETE' }));

  const cambiarCantidad = (item, cantidad) =>
    ejecutarAccion(() =>
      apiFetch(`/api/carritos/items/${item.itemId}`, { method: 'PUT', body: { cantidad } })
    );

  const vaciarCarrito = () => ejecutarAccion(() => apiFetch('/api/carritos', { method: 'DELETE' }));

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

      {carrito?.vencido && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error carrito__aviso">
          Pasaron más de 5 minutos sin confirmar la compra y el carrito se vació. Volvé a elegir tus
          butacas y productos.
        </p>
      )}

      {errorAccion !== null && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error carrito__aviso">
          {errorAccion}
        </p>
      )}

      {items.length > 0 && carrito.expiraEn && (
        <p className="carrito__aviso">
          Las butacas quedan reservadas hasta las{' '}
          {carrito.expiraEn.slice(11, 16)} hs. Confirmá la compra antes de esa hora.
        </p>
      )}

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
              <CarritoItem
                key={item.itemId}
                item={item}
                formatearMoneda={moneda}
                onQuitar={quitarItem}
                onCambiarCantidad={cambiarCantidad}
                ocupado={ocupado}
              />
            ))}

            <button
              type="button"
              className="boton boton--secundario carrito__vaciar"
              onClick={vaciarCarrito}
              disabled={ocupado}
            >
              Vaciar carrito
            </button>
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
