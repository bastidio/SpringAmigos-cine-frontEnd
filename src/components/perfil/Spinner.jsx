
const Spinner = () => {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Cargando perfil">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[var(--morado-texto)] border-t-transparent" />
    </div>
  );
};

export default Spinner;
