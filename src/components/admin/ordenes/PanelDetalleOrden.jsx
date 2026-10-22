const PanelDetalleOrden = ({ orden }) => {
  if (!orden) return null;

  const tieneProductos = orden.productos && orden.productos.length > 0;
  const tieneEntradas = orden.entradas && orden.entradas.length > 0;

  return (
    <div>
      <div className="orden-detalle-header">
        <div>
          <p className="detalle-label">Fecha</p>
          <strong>{new Date(orden.fecha).toLocaleString()}</strong>
        </div>
      </div>

      {/* Sección Películas / Entradas */}
      {tieneEntradas && (
        <>
          <h4 className="detalle-titulo">
            Entradas ({orden.entradas.length})
          </h4>
          <ul className="panel-detalle-lista">
            {orden.entradas.map((entrada, index) => (
              <li key={`entrada-${index}`} className="panel-detalle-item">
                <div>
                  {/* Leemos directamente el String 'pelicula' */}
                  <strong>{entrada.pelicula}</strong>
                  {/* Mostramos la info del asiento como detalle */}
                  <div className="detalle-item-precio">
                    Sala {entrada.sala} | Fila {entrada.fila}, Asiento {entrada.numero}
                  </div>
                </div>
                <strong className="detalle-item-total">
                  ${entrada.precio}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Sección Kiosco / Productos */}
      {tieneProductos && (
        <>
          <h4 className="detalle-titulo" style={{ marginTop: tieneEntradas ? '20px' : '0' }}>
            Kiosco ({orden.productos.length})
          </h4>
          <ul className="panel-detalle-lista">
            {orden.productos.map((item, index) => (
              <li key={`prod-${index}`} className="panel-detalle-item">
                <div>
                  <strong>{item.cantidad}x {item.producto?.nombre}</strong>
                  <div className="detalle-item-precio">${item.precioUnitario} c/u</div>
                </div>
                <strong className="detalle-item-total">
                  ${item.cantidad * item.precioUnitario}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="detalle-footer">
        <span>Total:</span>
        <strong className="detalle-total-valor">${orden.total}</strong>
      </div>
    </div>
  );
};

export default PanelDetalleOrden;