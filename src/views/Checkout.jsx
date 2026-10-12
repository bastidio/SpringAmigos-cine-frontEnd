import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Compras.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

function Checkout() {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState('');
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    apiFetch('/api/carritos')
      .then((data) => {
        if (activo) setCarrito(data);
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudo cargar el resumen.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  async function confirmarCompra() {
    setConfirmando(true);
    setError('');

    try {
      const compra = await apiFetch('/api/checkout', {
        method: 'POST',
      });

      setOrden(compra);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo completar la compra. Revisá el carrito e intentá nuevamente.',
      );
    } finally {
      setConfirmando(false);
    }
  }

  if (cargando) {
    return <section className="pagina"><p className="pagina__mensaje">Preparando checkout...</p></section>;
  }

  if (orden) {
    return (
      <section className="pagina compras">
        <div className="compras__vacio">
          <span className="compras__icono">✓</span>
          <p className="etiqueta etiqueta--dorada">COMPRA CONFIRMADA</p>
          <h1 className="compras__titulo">¡Gracias por tu compra!</h1>
          <p>
            Tu orden #{orden.id} se registró correctamente.
          </p>

          <div className="compras__linea compras__linea--total">
            <span>Total</span>
            <strong>{moneda(orden.total)}</strong>
          </div>

          {orden.entradas?.length > 0 && (
            <p className="compras__nota">
              Se generaron {orden.entradas.length}{' '}
              {orden.entradas.length === 1 ? 'entrada' : 'entradas'}.
            </p>
          )}

          <div className="compras__acciones">
            <button
              className="boton boton--primario"
              onClick={() => navigate('/mis-entradas')}
            >
              Ver mis entradas
            </button>
            <Link className="boton boton--secundario" to="/">
              Volver a cartelera
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const items = carrito?.items ?? [];

  return (
    <section className="pagina compras">
      <div className="compras__encabezado compras__encabezado--checkout">
        <Link className="checkout__volver" to="/carrito">← Volver al carrito</Link>
        <h1 className="compras__titulo">Checkout</h1>
        <p className="compras__subtitulo">Resumen de la orden</p>
      </div>

      {error && (
        <p role="alert" className="compras__error">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="compras__vacio compras__vacio--checkout">
          <span className="compras__icono" aria-hidden="true">◇</span>
          <h2>No hay artículos para comprar</h2>
          <p>Elegí una película para comenzar.</p>
          <Link className="boton boton--primario" to="/carrito">
            Volver al carrito
          </Link>
        </div>
      ) : (
        <div className="compras__layout">
          <div className="compras__lista">
            <h2 className="compras__lista-titulo">Resumen de la orden</h2>
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

            <Link className="boton boton--secundario" to="/carrito">
              ← Modificar carrito
            </Link>
          </div>

          <aside className="compras__resumen">
            <h2>Total</h2>

            <div className="compras__linea">
              <span>Entradas</span>
              <span>{items.reduce((total, item) => total + item.cantidad, 0)}</span>
            </div>

            <div className="compras__linea compras__linea--total">
              <span>Total estimado</span>
              <strong>{moneda(carrito.total)}</strong>
            </div>

            <p className="compras__nota">
              Al confirmar, el servidor volverá a validar la disponibilidad y
              el importe de la operación.
            </p>

            <button
              className="boton boton--primario compras__confirmar"
              type="button"
              disabled={confirmando || items.length === 0}
              onClick={confirmarCompra}
            >
              {confirmando ? 'Procesando compra...' : 'Confirmar compra'}
            </button>
            <p className="checkout__seguro"><span aria-hidden="true">♙</span> Pago seguro con encriptación SSL</p>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Checkout;