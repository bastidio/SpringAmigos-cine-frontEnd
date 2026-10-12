import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Compras.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarCarrito() {
    setCargando(true);
    setError('');
    try {
      setCarrito(await apiFetch('/api/carritos'));
    } catch (err) {
      setError(err.message || 'No se pudo cargar el carrito.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let activo = true;

    apiFetch('/api/carritos')
      .then((data) => {
        if (activo) setCarrito(data);
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudo cargar el carrito.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const items = carrito?.items ?? [];

  return (
    <section className="pagina compras">
      <div className="compras__encabezado">
        <h1 className="compras__titulo">Carrito</h1>
        <p className="compras__subtitulo">Revisá los artículos antes de continuar.</p>
      </div>

      {cargando && <p className="pagina__mensaje">Cargando carrito...</p>}

      {!cargando && error && (
        <div>
          <p role="alert" className="compras__error">{error}</p>
          <button className="boton boton--secundario" onClick={cargarCarrito}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && items.length === 0 && (
        <div className="compras__vacio compras__vacio--carrito">
          <span className="compras__icono" aria-hidden="true">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Elegí una película para comenzar.</p>
        </div>
      )}

      {!cargando && !error && items.length > 0 && (
        <div className="compras__layout">
          <div className="compras__lista">
            {items.map((item) => (
              <article className="compra-item" key={item.itemId}>
                <div className="compra-item__info">
                  <h2>{item.nombre}</h2>
                  <p>
                    {item.cantidad} × {moneda(item.precioUnitario)}
                  </p>
                </div>
                <div className="compra-item__subtotal">
                  <strong>{moneda(item.subtotal)}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="compras__resumen">
            <h2>Resumen</h2>

            <div className="compras__linea">
              <span>Cantidad de artículos</span>
              <span>{items.reduce((total, item) => total + item.cantidad, 0)}</span>
            </div>

            <div className="compras__linea compras__linea--total">
              <span>Total estimado</span>
              <strong>{moneda(carrito.total)}</strong>
            </div>

            <Link className="boton boton--primario compras__confirmar" to="/checkout">
              Continuar al checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Carrito;