import BotonAccion from '../ui/BotonAccion';
import CeldaProductoInfo from './CeldaProductoInfo';
import ControlStockInline from './ControlStockInLine';

const KioscoTable = ({ productos, onEditar, onActualizarStock, onCambiarEstado }) => {
  if (productos.length === 0) {
    return <p className="texto-muted kiosco-tabla-vacia">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>CATEGORÍA</th>
            <th>PRECIO</th>
            <th>DESC. %</th>
            <th>STOCK</th>
            <th>ESTADO</th>
            <th className="th-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const imagenUrl = p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : null;

            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <CeldaProductoInfo nombre={p.nombre} descripcion={p.descripcion} imagen={imagenUrl} variante="con-imagen" />
                </td>
                <td>{p.categoria?.nombre || 'N/A'}</td>
                <td>${p.precio}</td>
                <td>{p.descuento}%</td>
                <td>
                  <ControlStockInline 
                    productoId={p.id} 
                    stockInicial={p.stock} 
                    onActualizarStock={onActualizarStock} 
                    variante="tabla"
                  />
                </td>
                <td>
                  <button 
                    className={`etiqueta-estado-btn ${p.activo ? 'etiqueta--activa' : 'kiosco-etiqueta--inactiva'}`}
                    onClick={() => onCambiarEstado(p)}
                    title="Clic para cambiar estado"
                  >
                    {p.activo ? 'ACTIVO' : 'INACTIVO'}
                  </button>
                </td>
                <td className="acciones-celda">
                   <div className="admin-table-actions">
                      <BotonAccion variante="secundario" onClick={() => onEditar(p)}>Editar</BotonAccion>
                   </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KioscoTable;