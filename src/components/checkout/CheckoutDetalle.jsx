import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';
import CarritoItem from '../carrito/CarritoItem';
import AvisoReservaButacas from '../carrito/AvisoReservaButacas';
import useEdicionCarrito from '../carrito/useEdicionCarrito';
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
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();
  
  const { refrescarCantidad } = useCarrito();

  // Mismo carrito editable que el desplegable (cantidad, quitar, vaciar).
  const {
    visible,
    items,
    cantidadTotal,
    cargando,
    error: errorCarrito,
    errorAccion,
    guardando,
    cambiarCantidad,
    quitarItem,
  } = useEdicionCarrito();

  const confirmarCompra = async () => {
    setConfirmando(true);
    setError(null);

    try {
      const compra = await apiFetch('/api/checkout', {
        method: 'POST',
      });
      setOrden(compra);
      
      refrescarCantidad();
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

  const mensajeError = error ?? errorCarrito ?? errorAccion;

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

      {mensajeError !== null && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error checkout__alerta">
          {mensajeError}
        </p>
      )}

      {items.length === 0 ? (
        <div className="checkout__vacio">
          <span className="etiqueta">Sin artículos</span>
          <h2 className="checkout__vacio-titulo">No hay artículos para comprar</h2>
          <p className="checkout__vacio-texto">
            Elegí una película en la cartelera para comenzar tu compra.
          </p>
          <Link className="boton boton--primario" to="/">
            Volver a la cartelera
          </Link>
        </div>
      ) : (
        <div className="checkout__cuerpo">
          <div className="checkout__lista">
            <AvisoReservaButacas carrito={visible} items={items} />
            {items.map((item) => (
              <CarritoItem
                key={item.itemId}
                item={item}
                formatearMoneda={moneda}
                onQuitar={quitarItem}
                onCambiarCantidad={cambiarCantidad}
                ocupado={guardando}
              />
            ))}
          </div>

          <PanelCheckout
            cantidadItems={cantidadTotal}
            total={visible.total}
            confirmando={confirmando}
            deshabilitado={confirmando || guardando || items.length === 0}
            onConfirmar={confirmarCompra}
            formatearMoneda={moneda}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutDetalle;
