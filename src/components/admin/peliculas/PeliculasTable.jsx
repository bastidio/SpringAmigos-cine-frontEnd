import BotonAccion from '../ui/BotonAccion';

const PeliculasTable = ({ peliculas, onEditar, onEliminar }) => {
  if (peliculas.length === 0) {
    return (
      <div className="admin-table-container admin-table-empty">
        <p>No hay películas registradas.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>Título</th>
            <th>Clasificación</th>
            <th>Idioma</th>
            <th>Duración</th>
            <th className="th-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.poster_url ? (
                  <img 
                    src={p.poster_url} 
                    alt={`Poster de ${p.titulo}`} 
                    className="img-miniatura-tabla img-poster" 
                  />
                ) : (
                  <div className="img-miniatura-placeholder img-poster">
                    <span>Sin imagen</span>
                  </div>
                )}
              </td>
              <td><strong>{p.titulo}</strong></td>
              <td>{p.clasificacion}</td>
              <td>{p.idioma}</td>
              <td>{p.duracion} min</td>
              <td className="acciones-celda">
                <div className="admin-table-actions">
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