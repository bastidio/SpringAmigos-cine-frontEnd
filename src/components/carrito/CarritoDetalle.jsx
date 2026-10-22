import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';
import BotonVaciar from './BotonVaciar';
import CarritoItem from './CarritoItem';
import PanelResumenCarrito from './PanelResumenCarrito';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

const claseAviso = 'm-0 rounded-xl border border-solid px-4 py-3 text-sm';
const claseError = `${claseAviso} border-red-400/40 bg-red-400/10 text-red-300`;

// Cambios que el usuario ya hizo pero el back todavia no confirmo.
// cantidades: { [itemId]: cantidad nueva } (0 = quitar el item).
const SIN_CAMBIOS = { vaciar: false, cantidades: {} };

const hayCambios = (cambios) => cambios.vaciar || Object.keys(cambios.cantidades).length > 0;

// ACTUALIZACION OPTIMISTA: lo que se ve es el carrito del back con los cambios
// pendientes ya aplicados. Asi la pantalla cambia al instante, sin esperar la
// respuesta. El total es estimado hasta que el back conteste.
const aplicarCambios = (carrito, cambios) => {
  if (carrito === null || !hayCambios(cambios)) return carrito;
  if (cambios.vaciar) return { ...carrito, items: [], total: 0 };

  const items = (carrito.items ?? [])
    .map((item) => {
      const cantidad = cambios.cantidades[item.itemId];
      if (cantidad === undefined) return item;
      return { ...item, cantidad, subtotal: item.precioUnitario * cantidad };
    })
    .filter((item) => item.cantidad > 0);

  const total = items.reduce((suma, item) => suma + item.subtotal, 0);
  return { ...carrito, items, total };
};

// DELETE que no falla si el item ya no estaba (404): puede pasar si un pedido
// se cancelo pero el back llego a procesarlo, y despues se manda de nuevo.
const borrar = async (url, opciones) => {
  try {
    await apiFetch(url, { ...opciones, method: 'DELETE' });
  } catch (err) {
    if (err.status !== 404) throw err;
  }
};

// Componente padre del carrito: es el unico que tiene estado y logica. Le
// pide el carrito al back, maneja carrito/cargando/error y se lo pasa a los
// hijos por props. Para cambiar de vista avisa con onNavegar (lo decide App).
const CarritoDetalle = ({ token, onNavegar }) => {
  // Para avisarle al nav que cambio el carrito (el numero del icono).
  const { refrescarCantidad } = useCarrito();
  // El carrito tal como lo mando el back la ultima vez.
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // "Reintentar" suma 1: el efecto de carga depende de este numero y vuelve a correr.
  const [intento, setIntento] = useState(0);
  const [cambios, setCambios] = useState(SIN_CAMBIOS);
  // Error de un cambio: se muestra arriba de la lista sin tapar el carrito.
  const [errorAccion, setErrorAccion] = useState(null);

  // MONTAJE: CarritoMenu monta este componente cada vez que se abre el
  // desplegable, asi que el carrito se pide fresco en cada apertura.
  // ACTUALIZACION: si cambia el token o se toca "Reintentar", se pide de nuevo.
  useEffect(() => {
    const controller = new AbortController();

    const cargarCarrito = async () => {
      try {
        const data = await apiFetch('/api/carritos', { token, signal: controller.signal });
        setCarrito(data);
        setError(null);
      } catch (err) {
        // Si se cancelo por el desmontaje, no es un error real: se ignora.
        if (err.name === 'AbortError') return;
        setError(err.message || 'No se pudo cargar el carrito.');
      } finally {
        // Si se cancelo, el componente ya no esta: no se toca su estado.
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarCarrito();

    // DESMONTAJE: si se cierra el menu antes de la respuesta, se cancela.
    return () => controller.abort();
  }, [token, intento]);

  // ACTUALIZACION: cada vez que el usuario cambia algo, se le mandan al back
  // todos los cambios pendientes y despues se pide el carrito para quedar
  // igual que el back. Si llega otro click antes de terminar, la limpieza
  // cancela este envio y el efecto vuelve a correr con los cambios al dia
  // (las cantidades son absolutas, asi que mandarlas de nuevo no duplica nada).
  useEffect(() => {
    if (!hayCambios(cambios)) return;

    const controller = new AbortController();
    const { signal } = controller;

    const enviarCambios = async () => {
      try {
        if (cambios.vaciar) {
          await borrar('/api/carritos', { token, signal });
        } else {
          await Promise.all(
            Object.entries(cambios.cantidades).map(([itemId, cantidad]) =>
              cantidad === 0
                ? borrar(`/api/carritos/items/${itemId}`, { token, signal })
                : apiFetch(`/api/carritos/items/${itemId}`, {
                    method: 'PUT',
                    body: { cantidad },
                    token,
                    signal,
                  })
            )
          );
        }
        setErrorAccion(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        // Fallo: se avisa y, al pedir el carrito abajo, la pantalla vuelve a
        // mostrar lo que de verdad tiene el back.
        setErrorAccion(err.message);
      }

      try {
        setCarrito(await apiFetch('/api/carritos', { token, signal }));
        // El back ya tiene los cambios: se actualiza el numero del nav.
        refrescarCantidad();
      } catch (err) {
        if (err.name === 'AbortError') return;
        setErrorAccion(err.message);
      } finally {
        if (!signal.aborted) setCambios(SIN_CAMBIOS);
      }
    };

    enviarCambios();

    // DESMONTAJE (o un click nuevo): se cancela el envio en curso.
    return () => controller.abort();
  }, [cambios, token, refrescarCantidad]);

  const cambiarCantidad = (item, cantidad) => {
    setCambios({ ...cambios, cantidades: { ...cambios.cantidades, [item.itemId]: cantidad } });
  };

  const quitarItem = (item) => cambiarCantidad(item, 0);

  const vaciarCarrito = () => {
    setCambios({ vaciar: true, cantidades: {} });
  };

  const reintentar = () => {
    setCargando(true);
    setError(null);
    setIntento(intento + 1);
  };

  if (cargando) {
    return (
      <div className="flex justify-center py-10" role="status" aria-label="Cargando carrito">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error !== null) {
    return (
      <>
        <p role="alert" className={claseError}>
          {error}
        </p>
        <button
          type="button"
          onClick={reintentar}
          className="cursor-pointer rounded-xl border border-solid border-violet-500 bg-transparent px-4 py-2.5 text-sm font-semibold text-violet-300 transition-colors hover:bg-violet-500/10"
        >
          Reintentar
        </button>
      </>
    );
  }

  // Lo que se muestra: el carrito del back + los cambios que todavia viajan.
  const visible = aplicarCambios(carrito, cambios);
  const items = visible?.items ?? [];
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
  // Mientras haya cambios sin confirmar no se puede ir a pagar.
  const guardando = hayCambios(cambios);

  return (
    <>
      {/* Arriba: a la izquierda el tacho (vacia el carrito), a la derecha la cantidad. */}
      {cantidadTotal > 0 && (
        <div className="flex items-center justify-between gap-2">
          <BotonVaciar onVaciar={vaciarCarrito} />
          <span className="rounded-full border border-solid border-amber-400 px-3 py-1 text-[11px] font-semibold tracking-widest text-amber-300">
            {cantidadTotal} {cantidadTotal === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}
          </span>
        </div>
      )}

      {visible?.vencido && (
        <p role="alert" className={claseError}>
          Pasaron más de 5 minutos sin confirmar la compra y el carrito se vació. Volvé a elegir tus
          butacas y productos.
        </p>
      )}

      {errorAccion !== null && (
        <p role="alert" className={claseError}>
          {errorAccion}
        </p>
      )}

      {items.length > 0 && visible.expiraEn && (
        <p className={`${claseAviso} border-white/10 bg-white/5 text-gray-300`}>
          Las butacas quedan reservadas hasta las {visible.expiraEn.slice(11, 16)} hs. Confirmá la
          compra antes de esa hora.
        </p>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-solid border-white/10 bg-[#16101f] p-6 text-center">
          <h2 className="m-0 font-serif text-lg font-bold text-white">Tu carrito está vacío</h2>
          <p className="m-0 text-sm text-gray-400">
            Elegí una película en la cartelera o agregá productos del kiosco para comenzar.
          </p>
          <button
            type="button"
            onClick={() => onNavegar('/')}
            className="cursor-pointer rounded-xl border-0 bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Ver cartelera
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <CarritoItem
                key={item.itemId}
                item={item}
                formatearMoneda={moneda}
                onQuitar={quitarItem}
                onCambiarCantidad={cambiarCantidad}
              />
            ))}
          </div>

          <PanelResumenCarrito
            cantidadArticulos={cantidadTotal}
            total={visible.total}
            formatearMoneda={moneda}
            onIrACheckout={() => onNavegar('/checkout')}
            ocupado={guardando}
          />
        </>
      )}
    </>
  );
};

export default CarritoDetalle;
