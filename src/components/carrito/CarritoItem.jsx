

const claseBotonCantidad =
  'flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-solid border-white/15 bg-transparent p-0 text-xs leading-none text-white transition-colors hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40';

const CarritoItem = ({ item, formatearMoneda, onQuitar, onCambiarCantidad, ocupado = false }) => {
  
  const esProducto = item.tipo === 'PRODUCTO';

  return (
    <article className="flex items-center justify-between gap-2 rounded-lg border border-solid border-white/10 bg-[#16101f] px-3 py-2 text-white">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="m-0 truncate text-xs font-semibold text-white">{item.nombre}</h2>
        <p className="m-0 text-[11px] text-gray-400">
          {item.cantidad} × {formatearMoneda(item.precioUnitario)}
        </p>

        {(onCambiarCantidad || onQuitar) && (
          <div className="mt-1 flex items-center gap-2">
            {esProducto && onCambiarCantidad && (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  className={claseBotonCantidad}
                  onClick={() => onCambiarCantidad(item, item.cantidad - 1)}
                  disabled={ocupado || item.cantidad <= 1}
                  aria-label={'Restar una unidad de ' + item.nombre}
                >
                  −
                </button>
                <span>{item.cantidad}</span>
                <button
                  type="button"
                  className={claseBotonCantidad}
                  onClick={() => onCambiarCantidad(item, item.cantidad + 1)}
                  disabled={ocupado}
                  aria-label={'Sumar una unidad de ' + item.nombre}
                >
                  +
                </button>
              </div>
            )}
            {onQuitar && (
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent p-0 text-[11px] font-semibold text-red-400 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => onQuitar(item)}
                disabled={ocupado}
              >
                Quitar
              </button>
            )}
          </div>
        )}
      </div>
      <span className="shrink-0 text-xs font-semibold text-amber-300">
        {formatearMoneda(item.subtotal)}
      </span>
    </article>
  );
};

export default CarritoItem;
