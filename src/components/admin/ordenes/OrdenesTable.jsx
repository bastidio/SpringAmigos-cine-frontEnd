import BotonAccion from '../ui/BotonAccion';


const OrdenesTable = ({ ordenes, onVerDetalle, onCancelarOrden, onEditar }) => {
  if (ordenes.length === 0) return <p className="texto-muted">No se encontraron órdenes.</p>;

  const getClaseEstado = (estado) => {
    if (estado === 'PENDIENTE') return 'estado-pendiente';
    if (estado === 'COMPLETADA') return 'estado-completada';
    return 'estado-cancelada';
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FECHA</th>
            <th>CLIENTE</th>
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
              <td>{o.usuario?.nombre || `Usuario #${o.usuario?.id}`}</td>
              <td>${o.total}</td>
              <td>
                <span className={`etiqueta-estado-btn etiqueta-estado-fija ${getClaseEstado(o.estado)}`}>
                  {o.estado}
                </span>
              </td>
              <td className="acciones-celda">
                 <div className="admin-table-actions">
                    <BotonAccion variante="secundario" onClick={() => onVerDetalle(o)}>Ver</BotonAccion>
                    <BotonAccion variante="secundario" onClick={() => onEditar(o)}>Editar</BotonAccion>
                    {o.estado === 'PENDIENTE' && (
                      <button 
                        className="btn-cancelar-orden"
                        onClick={() => onCancelarOrden(o.id)}
                      >
                        Cancelar
                      </button>
                    )}
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