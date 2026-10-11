// Componente "tonto": circulo que gira mientras se espera la respuesta del back.
const Spinner = () => {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Cargando perfil">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-violet-500 border-t-transparent" />
    </div>
  );
};

export default Spinner;
