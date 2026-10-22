// Componente "tonto": el icono del carrito en el nav, que abre y cierra el
// desplegable. No sabe si el menu esta abierto: se lo dice el padre por props.
const CarritoBoton = ({ abierto, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={abierto ? 'Cerrar carrito' : 'Abrir carrito'}
      aria-expanded={abierto}
      aria-haspopup="dialog"
      aria-controls="menu-carrito"
      title="Carrito"
      className={`flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border-0 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--morado)] ${
        abierto
          ? 'bg-violet-500/15 text-[var(--morado)]'
          : 'bg-transparent text-[var(--texto-suave)] hover:bg-violet-500/10 hover:text-[var(--texto)]'
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
    </button>
  );
};

export default CarritoBoton;
