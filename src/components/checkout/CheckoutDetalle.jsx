import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import CarritoItem from '../carrito/CarritoItem';
import OrdenConfirmada from './OrdenConfirmada';
import PanelCheckout from './PanelCheckout';
import './Checkout.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

const CheckoutDetalle = () => {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();

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
          setError(err.message || 'No se pudo cargar el resumen.');
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

  const confirmarCompra = async () => {
    setConfirmando(true);
    setError(null);

    try {
      const compra = await apiFetch('/api/checkout', {
        method: 'POST',
      });
      setOrden(compra);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo completar la compra. Revisá el carrito e intentá nuevamente.'
      );
    } finally {
      setConfirmando(false);
    }
  };

  if (cargando) {
    return <p className="pagina_mensaje">Preparando checkout...</p>;
  }

  if (orden !== null) {
    return (
      <div className="checkout">
        <OrdenConfirmada
          orden={orden}
          formatearMoneda={moneda}
          irAMisEntradas={() => navigate('/mis-entradas')}
        />
      </div>
    );
  }

  const items = carrito?.items ?? [];
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="checkout">
      <Link className="checkout__volver" to="/carrito">
        ← Volver al carrito
      </Link>

      <div className="checkout__encabezado">
        <div>
          <h1 className="checkout__titulo">Checkout</h1>
          <p className="checkout__bajada">Resumen de la orden antes de confirmar el pago</p>
        </div>
      </div>

      {error !== null && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error checkout__alerta">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="checkout__vacio">
          <span className="etiqueta">Sin artículos</span>
          <h2 className="checkout__vacio-titulo">No hay artículos para comprar</h2>
          <p className="checkout__vacio-texto">
            Elegí una película en la cartelera para comenzar tu compra.
          </p>
          <Link className="boton boton--primario" to="/carrito">
            Volver al carrito
          </Link>
        </div>
      ) : (
        <div className="checkout__cuerpo">
          <div className="checkout__lista">
            {items.map((item) => (
              <CarritoItem key={item.itemId} item={item} formatearMoneda={moneda} />
            ))}

            <div className="checkout__acciones-lista">
              <Link className="boton boton--secundario" to="/carrito">
                ← Modificar carrito
              </Link>
            </div>
          </div>

          <PanelCheckout
            cantidadItems={cantidadTotal}
            total={carrito.total}
            confirmando={confirmando}
            deshabilitado={confirmando || items.length === 0}
            onConfirmar={confirmarCompra}
            formatearMoneda={moneda}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutDetalle;