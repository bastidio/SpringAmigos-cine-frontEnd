// src/components/admin/salas/SalasList.jsx
const SalasList = ({ salas, salaActiva, onSeleccionar }) => {
  if (salas.length === 0) return <p className="texto-muted">No hay salas cargadas.</p>;

  return (
    <div className="salas-lista">
      {salas.map((sala) => (
        <button
          key={sala.id}
          className={`tarjeta-sala ${salaActiva?.id === sala.id ? 'activa' : ''}`}
          onClick={() => onSeleccionar(sala)}
        >
          <h3 className="tarjeta-sala-titulo">{sala.nombre}</h3>
          <p className="tarjeta-sala-detalle">{sala.capacidad} butacas totales</p>
          {/* Dato placeholder hasta que lo agreguen en la BD */}
          <p className="tarjeta-sala-vip">VIP: A, B</p> 
        </button>
      ))}
    </div>
  );
};

export default SalasList;