import CarritoBoton from './CarritoBoton';
import CarritoLayout from './CarritoLayout';
import CarritoDetalle from './CarritoDetalle';







const CarritoMenu = ({ token, abierto, cantidad, onAlternar, onCerrar, onNavegar }) => {
  
  
  
  
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

      {/* Fondo transparente: un click en cualquier lugar de la pantalla cierra el
          carrito. Es top-0 + h-screen (no inset-0)
          porque el nav usa backdrop-filter y "fixed" se mide desde el nav, que esta
          pegado arriba de la pantalla. De ancho, left-0/right-0 y no w-screen:
          100vw incluye la barra de scroll vertical y agregaba un scroll horizontal. */}
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
          <CarritoDetalle token={token} onNavegar={onNavegar} />
        </CarritoLayout>
      )}
    </div>
  );
};

export default CarritoMenu;
