import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';
import CarritoItem from '../carrito/CarritoItem';
import AvisoReservaButacas from '../carrito/AvisoReservaButacas';
import useEdicionCarrito from '../carrito/useEdicionCarrito';
import CampoDescuento from './CampoDescuento';
import OrdenConfirmada from './OrdenConfirmada';
import PagoExitoso from './PagoExitoso';
import PagoTarjeta from './PagoTarjeta';
import PanelCheckout from './PanelCheckout';
import './Checkout.css';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

// Cuanto se muestra la animacion de confirmacion antes del mensaje de compra exitosa.
const DURACION_EXITO_MS = 1800;

const CheckoutDetalle = () => {
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState(null);
  const [exitoTerminado, setExitoTerminado] = useState(false);
  // Codigo de descuento: lo que el usuario aplico, lo que el backend calculo (subtotal, monto, total) y el error.
  const [codigoAplicado, setCodigoAplicado] = useState(null);
  const [descuento, setDescuento] = useState(null);
  const [errorDescuento, setErrorDescuento] = useState(null);
  const [revalidacion, setRevalidacion] = useState(0);
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
    recargar,
  } = useEdicionCarrito();

  const totalCarrito = visible?.total;
  useEffect(() => {
    if (codigoAplicado === null || guardando) return;

    const controller = new AbortController();

    const validarDescuento = async () => {
      try {
        const respuesta = await apiFetch(
          `/api/checkout/descuento?codigo=${encodeURIComponent(codigoAplicado)}`,
          { signal: controller.signal }
        );
        if (respuesta.valido) {
          setDescuento(respuesta);
          setErrorDescuento(null);
        } else {
          setCodigoAplicado(null);
          setDescuento(null);
          setErrorDescuento(respuesta.mensaje);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setCodigoAplicado(null);
        setDescuento(null);
        setErrorDescuento(err.message);
      }
    };

    validarDescuento();
    return () => controller.abort();
  }, [codigoAplicado, totalCarrito, guardando, revalidacion]);

  const aplicarDescuento = (codigo) => {
    setErrorDescuento(null);
    setDescuento(null);
    setCodigoAplicado(codigo);
  };

  const quitarDescuento = () => {
    setCodigoAplicado(null);
    setDescuento(null);
    setErrorDescuento(null);
  };

  useEffect(() => {
    if (orden === null) return;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
    const temporizador = setTimeout(() => setExitoTerminado(true), DURACION_EXITO_MS);
    return () => clearTimeout(temporizador);
  }, [orden]);

  const confirmarCompra = async () => {
    setConfirmando(true);
    setError(null);

    try {
      // Solo se manda el codigo: el backend lo vuelve a validar y recalcula el total.
      const compra = await apiFetch('/api/checkout', {
        method: 'POST',
        body: codigoAplicado !== null ? { codigoDescuento: codigoAplicado } : undefined,
      });
      setOrden(compra);
      
      refrescarCantidad();
      // El carrito ya esta vacio: se vuelve a pedir para frenar el temporizador de vencimiento.
      recargar();
    } catch (err) {
      // 409: puede ser que el carrito haya vencido; se recarga para que el hook lo detecte.
      if (err.status === 409) recargar();
      // Si el codigo dejo de ser valido, se revalida para quitarlo y avisar debajo del campo.
      if (codigoAplicado !== null) setRevalidacion((veces) => veces + 1);
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

  if (orden !== null && !exitoTerminado) {
    return (
      <div className="checkout">
        <PagoExitoso />
      </div>
    );
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
            descuento={descuento}
            formatearMoneda={moneda}
          >
            <CampoDescuento
              codigoAplicado={codigoAplicado}
              cargando={codigoAplicado !== null && descuento === null}
              error={errorDescuento}
              onAplicar={aplicarDescuento}
              onQuitar={quitarDescuento}
            />
          </PanelCheckout>

          <PagoTarjeta
            total={descuento !== null ? descuento.total : visible.total}
            formatearMoneda={moneda}
            pagando={confirmando}
            bloqueado={guardando}
            onPagar={confirmarCompra}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutDetalle;
