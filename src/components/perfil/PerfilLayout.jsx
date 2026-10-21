// Componente contenedor: el panel desplegable que cae debajo del icono del
// nav. Ocupa mas o menos un cuarto de la pantalla y, si el contenido no
// entra, scrollea adentro. Lo que le pase el padre va como children.
const PerfilLayout = ({ children }) => {
  return (
    <div
      id="menu-perfil"
      role="dialog"
      aria-label="Mi Perfil"
      className="absolute right-0 top-full z-50 mt-3 flex max-h-[calc(100vh-88px)] w-[25vw] min-w-[320px] flex-col gap-4 overflow-y-auto rounded-2xl border border-solid border-white/10 bg-[#0b0910] p-5 text-white shadow-2xl shadow-black/60 max-md:fixed max-md:inset-x-4 max-md:top-20 max-md:mt-0 max-md:w-auto max-md:min-w-0"
    >
      <h1 className="m-0 font-serif text-2xl font-bold text-white">Mi Perfil</h1>
      {children}
    </div>
  );
};

export default PerfilLayout;
