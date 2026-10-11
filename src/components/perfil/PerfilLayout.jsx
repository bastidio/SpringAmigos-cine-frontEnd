// Componente contenedor: arma la pagina (fondo, titulo, ancho maximo) y
// adentro pone lo que le pase la vista como children.
const PerfilLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-[#0b0910] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="m-0 font-serif text-4xl font-bold text-white">Mi Perfil</h1>
        {children}
      </div>
    </main>
  );
};

export default PerfilLayout;
