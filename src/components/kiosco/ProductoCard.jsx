import { useState } from 'react';


const ProductoCard = ({
  nombre,
  descripcion,
  categoria,
  precio,
  descuento,
  stock,
  imagen,
  cantidad = 0,
  ocupado = false,
  onAgregar,
  onCambiarCantidad,
}) => {
  
  const [imagenFallo, setImagenFallo] = useState(false);

  
  const tieneDescuento = descuento > 0;
  const precioFinal = tieneDescuento ? precio - (precio * descuento) / 100 : precio;

  
  const formato = { maximumFractionDigits: 2 };

  return (
    <article className="producto-card">
      <div className="producto-card_marco">
        {imagen && !imagenFallo ? (
          <img
            className="producto-card_imagen"
            src={imagen}
            alt={nombre}
            loading="lazy"
            onError={() => setImagenFallo(true)}
          />
        ) : (
          <span className="producto-card_imagen sin-imagen">Sin imagen</span>
        )}
        {tieneDescuento && (
          <span className="etiqueta etiqueta--dorada etiqueta--sobre-imagen producto-card_descuento">
            {descuento}% off
          </span>
        )}
      </div>

      <div className="producto-card_contenido">
        <p className="producto-card_categoria">{categoria}</p>
        <h3 className="producto-card_nombre">{nombre}</h3>
        <p className="producto-card_descripcion">{descripcion}</p>

        <div className="producto-card_fila">
          <p className="producto-card_precio">
            ${precioFinal.toLocaleString('es-AR', formato)}
            {tieneDescuento && (
              <span className="producto-card_precio-anterior">
                ${precio.toLocaleString('es-AR', formato)}
              </span>
            )}
          </p>
          {stock > 0 && stock < 5 && <p className="producto-card_ultimas">¡Últimas {stock}!</p>}
        </div>

        {cantidad > 0 ? (
          <div className="producto-card_contador" role="group" aria-label={`Cantidad de ${nombre} en el carrito`}>
            <button
              type="button"
              className="producto-card_contador-boton"
              onClick={() => onCambiarCantidad(cantidad - 1)}
              disabled={ocupado}
              aria-label={cantidad === 1 ? `Quitar ${nombre} del carrito` : `Restar una unidad de ${nombre}`}
            >
              −
            </button>
            <span className="producto-card_contador-numero" aria-live="polite">
              {cantidad}
            </span>
            <button
              type="button"
              className="producto-card_contador-boton"
              onClick={() => onCambiarCantidad(cantidad + 1)}
              disabled={ocupado || cantidad >= stock}
              aria-label={`Sumar una unidad de ${nombre}`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="boton boton--primario producto-card_agregar"
            onClick={onAgregar}
            disabled={stock <= 0 || ocupado}
          >
            {stock <= 0 ? 'Sin stock' : ocupado ? 'Agregando...' : 'Agregar'}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductoCard;
