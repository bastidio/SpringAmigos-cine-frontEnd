

const UltimasOrdenesWidget = ({ ordenes }) => {
  const ultimas = ordenes.slice(-5).reverse();

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <h2 className="dashboard-widget-titulo">Últimas Órdenes</h2>
      </div>

      <table className="tabla-dashboard">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ultimas.map(o => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{new Date(o.fecha).toLocaleDateString()}</td>
              <td>{o.usuario?.nombre || 'Usuario'}</td>
              <td>
                <span className={`etiqueta-rol ${o.estado === 'PENDIENTE' ? 'estado-pendiente' : (o.estado === 'COMPLETADA' || o.estado === 'CONFIRMADA') ? 'estado-completada' : 'estado-cancelada'}`}>
                  {o.estado}
                </span>
              </td>
              <td><strong>${o.total}</strong></td>
            </tr>
          ))}
          {ultimas.length === 0 && (
            <tr>
              <td colSpan="5" className="texto-muted tabla-celda-centrada">
                No hay órdenes recientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UltimasOrdenesWidget;