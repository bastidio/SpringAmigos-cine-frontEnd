import BotonAccion from '../ui/BotonAccion';

const PeliculasTable = ({ peliculas, onEditar, onEliminar }) => {
  if (peliculas.length === 0) return <p style={{ color: 'var(--text-muted)' }}>No hay películas registradas.</p>;

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Clasificación</th>
            <th>Idioma</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><strong>{p.titulo}</strong></td>
              <td>{p.clasificacion}</td>
              <td>{p.idioma}</td>
              <td>{p.duracion} min</td>
              <td style={{ display: 'flex', gap: '8px' }}>
                <BotonAccion variante="secundario" onClick={() => onEditar(p)}>Editar</BotonAccion>
                <BotonAccion variante="secundario" onClick={() => onEliminar(p.id)}>Borrar</BotonAccion>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeliculasTable;