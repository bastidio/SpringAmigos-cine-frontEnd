

const PanelDetalleOrden = ({ orden }) => {
  if (!orden) return null;

  return (
    <div>
      <div className="detalle-header">
        <div>
          <p className="detalle-label">Cliente</p>
          <strong>{orden.usuario?.nombre || `Usuario #${orden.usuario?.id}`}</strong>
        </div>
        <div>
          <p className="detalle-label">Fecha</p>
          <strong>{new Date(orden.fecha).toLocaleString()}</strong>
        </div>
      </div>

      <h4 className="detalle-titulo">
        Productos ({orden.items?.length || 0})
      </h4>
      
      <ul className="panel-detalle-lista">
        {orden.items?.map((item, index) => (
          <li key={index} className="panel-detalle-item">
            <div>
              <strong>{item.cantidad}x {item.producto?.nombre}</strong>
              <div className="detalle-item-precio">${item.precio_unitario} c/u</div>
            </div>
            <strong className="detalle-item-total">
              ${item.cantidad * item.precio_unitario}
            </strong>
          </li>
        ))}
      </ul>

      <div className="detalle-footer">
        <span>Total:</span>
        <strong className="detalle-total-valor">${orden.total}</strong>
      </div>
    </div>
  );
};

export default PanelDetalleOrden;