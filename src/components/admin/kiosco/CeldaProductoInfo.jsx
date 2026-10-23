

const CeldaProductoInfo = ({ nombre, descripcion, imagen, variante = 'compacto' }) => {
  return (
    <div className={`kiosco-producto-info--${variante}`}>
      {imagen ? (
        <img src={imagen} alt={nombre} className="celda-producto-img" />
      ) : (
        <div className="celda-producto-img-placeholder">Sin img</div>
      )}
      <div className="celda-producto-texto">
        <strong className={`kiosco-producto-nombre--${variante}`}>{nombre}</strong>
        {descripcion && (
          <span className={`kiosco-producto-desc--${variante}`}>{descripcion}</span>
        )}
      </div>
    </div>
  );
};

export default CeldaProductoInfo;