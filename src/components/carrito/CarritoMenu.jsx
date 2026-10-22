import CarritoBoton from './CarritoBoton';
import CarritoLayout from './CarritoLayout';
import CarritoDetalle from './CarritoDetalle';

// Componente del menu desplegable del carrito. A diferencia del perfil, si
// esta abierto o cerrado lo decide App (el carrito se puede abrir desde otras
// vistas), asi que aca solo se avisa con callbacks. CarritoDetalle se monta
// recien cuando se abre el menu (y se desmonta al cerrarlo).
// Todo con eventos de React: no se escucha nada en document ni se lee el DOM
// con refs.
const CarritoMenu = ({ token, abierto, onAlternar, onCerrar, onNavegar }) => {
  // El foco se fue a otro elemento fuera del contenedor (por ejemplo, con Tab).
  // relatedTarget es a donde fue el foco. Si es null no se cierra: pasa cuando
  // un boton se deshabilita o desaparece (al tocar +, - o quitar), y el click
  // afuera ya lo resuelve el fondo transparente de abajo.
  const cerrarSiSaleElFoco = (evento) => {
    const destino = evento.relatedTarget;
    if (abierto && destino !== null && !evento.currentTarget.contains(destino)) {
      onCerrar();
    }
  };

  // Escape: funciona porque al abrir, el foco queda adentro del panel.
  const cerrarConEscape = (evento) => {
    if (abierto && evento.key === 'Escape') {
      onCerrar();
    }
  };

  return (
    // stopPropagation: en celular el icono esta dentro del menu hamburguesa,
    // que se cierra con cualquier click adentro. Asi no se cierra al abrir el carrito.
    <div
      className="relative"
      onClick={(evento) => evento.stopPropagation()}
      onBlur={cerrarSiSaleElFoco}
      onKeyDown={cerrarConEscape}
    >
      {/* z-50: el icono queda por encima del fondo, para poder cerrar tocandolo. */}
      <div className="relative z-50">
        <CarritoBoton abierto={abierto} onClick={onAlternar} />
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
