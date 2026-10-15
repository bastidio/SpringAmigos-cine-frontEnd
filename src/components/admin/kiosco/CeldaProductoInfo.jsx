

const CeldaProductoInfo = ({ nombre, descripcion }) => {
  return (
    <div className="celda-producto-info">
      <strong className="celda-producto-nombre">{nombre}</strong>
      {descripcion && (
        <span className="celda-producto-desc">{descripcion}</span>
      )}
    </div>
  );
};

export default CeldaProductoInfo;