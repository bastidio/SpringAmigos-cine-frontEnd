const CarritoItem = ({ item, formatearMoneda }) => {
  return (
    <article className="carrito-item">
      <div className="carrito-item__info">
        <h2 className="carrito-item__titulo">{item.nombre}</h2>
        <p className="carrito-item__detalle">
          {item.cantidad} × {formatearMoneda(item.precioUnitario)}
        </p>
      </div>
      <div className="carrito-item__subtotal">
        <span className="carrito-item__monto">{formatearMoneda(item.subtotal)}</span>
      </div>
    </article>
  );
};

export default CarritoItem;