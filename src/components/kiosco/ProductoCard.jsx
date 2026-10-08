// Componente "tonto": la tarjeta de UN producto del kiosco.
// ProductoList la renderiza una vez por producto.
const ProductoCard = ({ nombre, descripcion, categoria, precio, descuento, stock, imagen }) => {
  // El back guarda el descuento como porcentaje (0 a 100).
  const tieneDescuento = descuento > 0;
  const precioFinal = tieneDescuento ? precio - (precio * descuento) / 100 : precio;

  // Formato de precio argentino, con dos decimales como maximo (igual que el back).
  const formato = { maximumFractionDigits: 2 };

  return (
    <article className="producto-card">
      <div className="producto-card__marco">
        {imagen ? (
          <img className="producto-card__imagen" src={imagen} alt="" />
        ) : (
          <span className="producto-card__imagen sin-imagen">Sin imagen</span>
        )}
        {tieneDescuento && (
          <span className="etiqueta etiqueta--dorada etiqueta--sobre-imagen producto-card__descuento">
            {descuento}% off
          </span>
        )}
      </div>

      <div className="producto-card__contenido">
        <p className="producto-card__categoria">{categoria}</p>
        <h3 className="producto-card__nombre">{nombre}</h3>
        <p className="producto-card__descripcion">{descripcion}</p>

        <div className="producto-card__fila">
          <p className="producto-card__precio">
            ${precioFinal.toLocaleString('es-AR', formato)}
            {tieneDescuento && (
              <span className="producto-card__precio-anterior">
                ${precio.toLocaleString('es-AR', formato)}
              </span>
            )}
          </p>
          {stock > 0 && stock < 5 && <p className="producto-card__ultimas">¡Últimas {stock}!</p>}
        </div>

        {/* Todavia no esta conectado al carrito: por eso queda deshabilitado. */}
        <button type="button" className="boton boton--primario producto-card__agregar" disabled>
          {stock > 0 ? 'Agregar' : 'Sin stock'}
        </button>
      </div>
    </article>
  );
};

export default ProductoCard;
