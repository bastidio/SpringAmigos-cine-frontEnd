
const FiltroBoton = ({ opciones, seleccionActual, onSeleccionar }) => {
  return (
    <div className="filtro-grupo">
      {opciones.map((opcion) => (
        <button
          key={opcion}
          className={`filtro-item ${seleccionActual === opcion ? 'activo' : ''}`}
          onClick={() => onSeleccionar(opcion)}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
};

export default FiltroBoton;