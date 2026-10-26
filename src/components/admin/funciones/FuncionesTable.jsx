import BotonAccion from '../ui/BotonAccion';

const FuncionesTable = ({ funciones, onEditar, onEliminar }) => {
  if (funciones.length === 0) {
    return (
      <div className="admin-table-container admin-table-empty">
        <p>No hay funciones para este día.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Película</th>
            <th>Sala</th>
            <th>Horario</th>
            <th>Idioma</th>
            <th>Formato</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {funciones.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td><strong>{f.pelicula?.titulo || 'N/A'}</strong></td>
              <td>{f.sala?.nombre || 'N/A'}</td>
              {}
              <td>{f.horario ? f.horario.replace('T', ' ') : ''}</td>
              <td>{f.idioma}</td>
              <td>{f.formato}</td>
              <td>${f.precio_base}</td>
              <td className="admin-table-actions">
                <BotonAccion variante="secundario" onClick={() => onEditar(f)}>Editar</BotonAccion>
                <BotonAccion variante="secundario" onClick={() => onEliminar(f.id)}>Borrar</BotonAccion>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuncionesTable;