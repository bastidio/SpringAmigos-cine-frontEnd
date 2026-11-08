import BotonAccion from '../ui/BotonAccion';

// "2026-12-31" -> "31/12/2026" sin pasar por Date (evita correr un dia por la zona horaria).
const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin vencimiento';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

// Mismo criterio que el backend: vale hasta el fin del dia de vencimiento.
const estaVencido = (fecha) => {
  if (!fecha) return false;
  const hoy = new Date();
  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  return fecha < hoyISO;
};

const DescuentosTable = ({ descuentos, onEditar, onEliminar, onReactivar }) => {
  if (descuentos.length === 0) {
    return <p className="texto-muted kiosco-tabla-vacia">Todavía no hay códigos de descuento.</p>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>CÓDIGO</th>
            <th>DESCUENTO</th>
            <th>VENCIMIENTO</th>
            <th>ESTADO</th>
            <th className="th-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {descuentos.map((d) => {
            const vencido = d.activo && estaVencido(d.fechaVencimiento);
            const vigente = d.activo && !vencido;

            return (
              <tr key={d.id}>
                <td>
                  <span className="titulo">{d.codigo}</span>
                </td>
                <td>{d.porcentaje}%</td>
                <td>{formatearFecha(d.fechaVencimiento)}</td>
                <td>
                  <span className={`etiqueta-estado-btn etiqueta-estado-fija ${vigente ? 'etiqueta--activa' : 'etiqueta--inactiva'}`}>
                    {!d.activo ? 'INACTIVO' : vencido ? 'VENCIDO' : 'ACTIVO'}
                  </span>
                </td>
                <td className="acciones-celda">
                  <div className="admin-table-actions">
                    <BotonAccion variante="secundario" onClick={() => onEditar(d)}>Editar</BotonAccion>
                    {d.activo ? (
                      <BotonAccion variante="eliminar" onClick={() => onEliminar(d)}>Eliminar</BotonAccion>
                    ) : (
                      <BotonAccion variante="secundario" onClick={() => onReactivar(d)}>Reactivar</BotonAccion>
                    )}
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

export default DescuentosTable;
