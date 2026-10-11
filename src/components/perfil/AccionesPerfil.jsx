// Componente "tonto": los dos botones de abajo. No sabe que hacen: solo
// llama a las funciones que le llegan por props.
const AccionesPerfil = ({ onIrAEntradas, onLogout }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onIrAEntradas}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-solid border-violet-500 bg-transparent px-4 py-3 text-sm font-semibold text-violet-300 transition-colors hover:bg-violet-500/10"
      >
        {/* Icono de ticket */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
        Mis Entradas
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="cursor-pointer rounded-xl border border-solid border-red-400 bg-transparent px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default AccionesPerfil;
