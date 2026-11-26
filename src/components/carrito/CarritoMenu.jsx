import CarritoBoton from './CarritoBoton';
import CarritoLayout from './CarritoLayout';
import CarritoDetalle from './CarritoDetalle';

const CarritoMenu = ({ abierto, cantidad, onAlternar, onCerrar, irA }) => {
  
  const cerrarSiSaleElFoco = (evento) => {
    const destino = evento.relatedTarget;
    if (abierto && destino !== null && !evento.currentTarget.contains(destino)) {
      onCerrar();
    }
  };
  
  const cerrarConEscape = (evento) => {
    if (abierto && evento.key === 'Escape') {
      onCerrar();
    }
  };

  return (
    
    <div
      className="relative"
      onClick={(evento) => evento.stopPropagation()}
      onBlur={cerrarSiSaleElFoco}
      onKeyDown={cerrarConEscape}
    >
      {}
      <div className="relative z-50">
        <CarritoBoton abierto={abierto} cantidad={cantidad} onClick={onAlternar} />
      </div>

      {abierto && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar carrito"
          onClick={onCerrar}
          className="fixed left-0 right-0 top-0 z-40 h-screen cursor-default border-0 bg-transparent p-0"
        />
      )}

      {abierto && (
        <CarritoLayout>
          <CarritoDetalle irA={irA} />
        </CarritoLayout>
      )}
    </div>
  );
};

export default CarritoMenu;
