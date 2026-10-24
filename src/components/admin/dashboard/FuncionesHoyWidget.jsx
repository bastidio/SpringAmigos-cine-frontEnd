

const FuncionesHoyWidget = ({ funciones }) => {
  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <h2 className="dashboard-widget-titulo">🎬 Funciones de Hoy</h2>
      </div>

      <table className="tabla-dashboard">
        <thead>
          <tr>
            <th>Película</th>
            <th>Horario</th>
            <th>Sala</th>
            <th>Capacidad</th>
          </tr>
        </thead>
        <tbody>
          {funciones.length === 0 ? (
            <tr>
              <td colSpan="4" className="texto-muted tabla-celda-centrada">
                No hay funciones programadas o el servidor no respondió.
              </td>
            </tr>
          ) : (
            funciones.map(f => (
              <tr key={f.id}>
                <td><strong>{f.pelicula?.titulo}</strong></td>
                <td>{new Date(f.horario).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{f.sala?.nombre}</td>
                <td>{f.entradasVendidas} / {f.sala?.capacidad}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FuncionesHoyWidget;