import BotonAccion from '../ui/BotonAccion';

const OrdenesTable = ({ ordenes, onVerDetalle, onCancelarOrden }) => {
  if (ordenes.length === 0) return <p className="texto-muted">No se encontraron órdenes.</p>;

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FECHA</th>
            <th>TOTAL</th>
            <th>ESTADO</th>
            <th className="th-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.fecha).toLocaleString()}</td>
              <td>${o.total}</td>
              <td>
                {o.estado === 'CONFIRMADA' ? (
                  <button 
                    className="etiqueta-estado-btn etiqueta--activa"
                    onClick={() => onCancelarOrden(o.id)}
                    title="Click para cancelar orden"
                  >
                    {o.estado}
                  </button>
                ) : (
                  /* Si está cancelada, se muestra como span y el mouse no cambia (cursor: default) */
                  <span 
                    className="etiqueta-estado-btn orden-etiqueta--inactiva" 
                    style={{ cursor: 'default' }}
                  >
                    {o.estado}
                  </span>
                )}
              </td>
              <td className="acciones-celda">
                 <div className="admin-table-actions">
                    <BotonAccion variante="secundario" onClick={() => onVerDetalle(o)}>Ver Detalle</BotonAccion>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdenesTable;