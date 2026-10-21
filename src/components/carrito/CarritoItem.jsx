// onQuitar y onCambiarCantidad son opcionales: el checkout reusa este
// componente solo para mostrar, sin botones.
const CarritoItem = ({ item, formatearMoneda, onQuitar, onCambiarCantidad, ocupado = false }) => {
  // La butaca es unitaria en el back: solo los productos cambian de cantidad.
  const esProducto = item.tipo === 'PRODUCTO';

  return (
    <article className="carrito-item">
      <div className="carrito-item__info">
        <h2 className="carrito-item__titulo">{item.nombre}</h2>
        <p className="carrito-item__detalle">
          {item.cantidad} × {formatearMoneda(item.precioUnitario)}
        </p>

        {(onCambiarCantidad || onQuitar) && (
          <div className="carrito-item__acciones">
            {esProducto && onCambiarCantidad && (
              <div className="carrito-item__cantidad">
                <button
                  type="button"
                  className="carrito-item__boton"
                  onClick={() => onCambiarCantidad(item, item.cantidad - 1)}
                  disabled={ocupado || item.cantidad <= 1}
                  aria-label={'Restar una unidad de ' + item.nombre}
                >
                  −
                </button>
                <span>{item.cantidad}</span>
                <button
                  type="button"
                  className="carrito-item__boton"
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
                className="carrito-item__quitar"
                onClick={() => onQuitar(item)}
                disabled={ocupado}
              >
                Quitar
              </button>
            )}
          </div>
        )}
      </div>
      <div className="carrito-item__subtotal">
        <span className="carrito-item__monto">{formatearMoneda(item.subtotal)}</span>
      </div>
    </article>
  );
};

export default CarritoItem;
