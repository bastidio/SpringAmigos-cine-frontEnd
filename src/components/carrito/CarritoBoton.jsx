// Componente "tonto": el icono del carrito en el nav, que abre y cierra el
// desplegable. No sabe si el menu esta abierto ni cuantos productos hay: se lo
// dice el padre por props. Con productos, muestra una burbuja con la cantidad.
const CarritoBoton = ({ abierto, cantidad = 0, onClick }) => {
  // Mas de 99 no entra en la burbuja: se muestra 99+.
  const textoCantidad = cantidad > 99 ? '99+' : String(cantidad);
  const etiqueta = abierto ? 'Cerrar carrito' : 'Abrir carrito';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={cantidad > 0 ? `${etiqueta}, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}` : etiqueta}
      aria-expanded={abierto}
      aria-haspopup="dialog"
      aria-controls="menu-carrito"
      title="Carrito"
      className={`relative flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border-0 p-0 text-[var(--dorado)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--morado)] ${
        abierto
          ? 'bg-[rgba(212,175,55,0.15)]'
          : 'bg-transparent hover:bg-[rgba(212,175,55,0.12)]'
      }`}
    >
      {/* Icono de carrito */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Burbuja violeta arriba a la derecha con la cantidad en blanco. */}
      {cantidad > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--morado)] px-1 text-[11px] font-bold leading-none text-white"
        >
          {textoCantidad}
        </span>
      )}
    </button>
  );
};

export default CarritoBoton;
