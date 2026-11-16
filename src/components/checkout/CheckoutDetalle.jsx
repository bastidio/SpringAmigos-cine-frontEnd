import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarrito, vaciarCarritoLocal } from '../../redux/carritoSlice';
import { confirmarCompra } from '../../redux/ordenesSlice';
import { validarDescuento, limpiarValidacion } from '../../redux/descuentosSlice';
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

// El tiempo que se muestra la animacion de confirmacion
const DURACION_EXITO_MS = 1800;

const CheckoutDetalle = () => {
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState(null);
  const [exitoTerminado, setExitoTerminado] = useState(false);
  const [codigoAplicado, setCodigoAplicado] = useState(null);
  const [errorDescuento, setErrorDescuento] = useState(null);
  const [revalidacion, setRevalidacion] = useState(0);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { validacion } = useSelector((state) => state.descuentos);
  // Solo cuenta si hay un codigo aplicado en esta pantalla y el back lo dio por valido.
  const descuento = codigoAplicado !== null && validacion !== null && validacion.valido ? validacion : null;

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

  const totalCarrito = visible?.total;
  useEffect(() => {
    if (codigoAplicado === null || guardando) return;

    const revalidarDescuento = async () => {
      const res = await dispatch(validarDescuento(codigoAplicado));
      if (res.error) {
        setCodigoAplicado(null);
        setErrorDescuento('No se pudo validar el código. Intentá nuevamente.');
      } else if (res.payload.valido) {
        setErrorDescuento(null);
      } else {
        setCodigoAplicado(null);
        setErrorDescuento(res.payload.mensaje);
      }
    };

    revalidarDescuento();
  }, [dispatch, codigoAplicado, totalCarrito, guardando, revalidacion]);

  const aplicarDescuento = (codigo) => {
    setErrorDescuento(null);
    dispatch(limpiarValidacion());
    setCodigoAplicado(codigo);
  };

  const quitarDescuento = () => {
    setCodigoAplicado(null);
    dispatch(limpiarValidacion());
    setErrorDescuento(null);
  };

  useEffect(() => {
    if (orden === null) return;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
    const temporizador = setTimeout(() => setExitoTerminado(true), DURACION_EXITO_MS);
    return () => clearTimeout(temporizador);
  }, [orden]);

  const pagar = async () => {
    setConfirmando(true);
    setError(null);

    const res = await dispatch(confirmarCompra(codigoAplicado !== null ? { codigoDescuento: codigoAplicado } : undefined));
    setConfirmando(false);
    if (!res.error) {
      setOrden(res.payload);
      // El backend vacio el carrito al comprar: se refleja en el estado (frena tambien el temporizador).
      dispatch(vaciarCarritoLocal());
      return;
    }
    dispatch(fetchCarrito());
    if (codigoAplicado !== null) setRevalidacion((veces) => veces + 1);
    setError('No se pudo completar la compra. Revisá el carrito e intentá nuevamente.');
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
            onPagar={pagar}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutDetalle;
