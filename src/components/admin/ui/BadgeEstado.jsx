const BadgeEstado = ({ estado }) => {
  
  const esPositivo = estado === 'Activo' || estado === 'Confirmada';
  const claseColor = esPositivo ? 'badge-positivo' : 'badge-alerta';

  return (
    <span className={`badge ${claseColor}`}>
      <span className="badge-dot"></span>
      {estado}
    </span>
  );
};

export default BadgeEstado;