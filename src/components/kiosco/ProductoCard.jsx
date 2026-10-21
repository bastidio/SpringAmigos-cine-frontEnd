import { useState } from 'react';


const ProductoCard = ({
  nombre,
  descripcion,
  categoria,
  precio,
  descuento,
  stock,
  imagen,
  onAgregar,
  agregando = false,
  agregado = false,
}) => {
  // Si la URL no carga (onError), se muestra el placeholder en su lugar.
  const [imagenFallo, setImagenFallo] = useState(false);

  // El back guarda el descuento como porcentaje (0 a 100).
  const tieneDescuento = descuento > 0;
  const precioFinal = tieneDescuento ? precio - (precio * descuento) / 100 : precio;

  // Formato de precio argentino, con dos decimales como maximo (igual que el back).
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

        <button
          type="button"
          className="boton boton--primario producto-card_agregar"
          onClick={onAgregar}
          disabled={stock <= 0 || agregando}
        >
          {stock <= 0 ? 'Sin stock' : agregando ? 'Agregando...' : agregado ? '¡Agregado! +1' : 'Agregar'}
        </button>
      </div>
    </article>
  );
};

export default ProductoCard;
