import BotonVaciar from './BotonVaciar';
import CarritoItem from './CarritoItem';
import PanelResumenCarrito from './PanelResumenCarrito';
import AvisoReservaButacas from './AvisoReservaButacas';
import useEdicionCarrito from './useEdicionCarrito';

const moneda = (valor) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

const claseAviso = 'm-0 rounded-xl border border-solid px-4 py-3 text-sm';
const claseError = `${claseAviso} border-red-400/40 bg-red-400/10 text-red-300`;



const CarritoDetalle = ({ token, onNavegar }) => {
  
  const {
    visible,
    items,
    cantidadTotal,
    cargando,
    error,
    errorAccion,
    guardando,
    cambiarCantidad,
    quitarItem,
    vaciarCarrito,
    reintentar,
  } = useEdicionCarrito(token);

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

  
  return (
    <>
      {}
      {cantidadTotal > 0 && (
        <div className="flex items-center justify-between gap-2">
          <BotonVaciar onVaciar={vaciarCarrito} />
          <span className="rounded-full border border-solid border-amber-400 px-3 py-1 text-[11px] font-semibold tracking-widest text-amber-300">
            {cantidadTotal} {cantidadTotal === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}
          </span>
        </div>
      )}

      <AvisoReservaButacas carrito={visible} items={items} />

      {errorAccion !== null && (
        <p role="alert" className={claseError}>
          {errorAccion}
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
