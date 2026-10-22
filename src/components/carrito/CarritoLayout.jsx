// Componente contenedor: el panel desplegable que cae debajo del icono del
// carrito. Ocupa mas o menos un cuarto de la pantalla y, si el contenido no
// entra, scrollea adentro. Lo que le pase el padre va como children.
// tabIndex -1 + autoFocus: al abrirse, el foco entra al panel (lo hace React).
// Asi CarritoMenu se entera del click afuera (onBlur) y de la tecla Escape.
const CarritoLayout = ({ children }) => {
  return (
    <div
      id="menu-carrito"
      role="dialog"
      aria-label="Carrito"
      tabIndex={-1}
      autoFocus
      className="outline-none absolute right-0 top-full z-50 mt-3 flex max-h-[calc(100vh-88px)] w-[25vw] min-w-[320px] flex-col gap-4 overflow-y-auto rounded-2xl border border-solid border-white/10 bg-[#0b0910] p-5 text-left text-white shadow-2xl shadow-black/60 max-md:fixed max-md:inset-x-4 max-md:top-20 max-md:mt-0 max-md:w-auto max-md:min-w-0"
    >
      <h1 className="m-0 font-serif text-2xl font-bold text-white">Carrito</h1>
      {children}
    </div>
  );
};

export default CarritoLayout;
