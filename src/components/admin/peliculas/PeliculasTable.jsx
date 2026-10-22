import BotonAccion from '../ui/BotonAccion';

const PeliculasTable = ({ peliculas, onEditar, onEliminar }) => {
  if (peliculas.length === 0) return <p style={{ color: 'var(--text-muted)' }}>No hay películas registradas.</p>;

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>TÍTULO</th>
            <th>CLASIFICACIÓN</th>
            <th>IDIOMA</th>
            <th>DURACIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <div className="admin-celda-imagen-wrapper">
                  {p.poster_url ? (
                    <img src={p.poster_url} alt={p.titulo} className="admin-celda-img poster" />
                  ) : (
                    <div className="admin-celda-placeholder poster">🎬</div>
                  )}
                  <strong>{p.titulo}</strong>
                </div>
              </td>
              <td>{p.clasificacion}</td>
              <td>{p.idioma}</td>
              <td>{p.duracion} min</td>
              <td className="acciones-celda">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <BotonAccion variante="secundario" onClick={() => onEditar(p)}>Editar</BotonAccion>
                  <BotonAccion variante="secundario" onClick={() => onEliminar(p.id)}>Borrar</BotonAccion>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeliculasTable;