

const BotonVaciar = ({ onVaciar, ocupado = false }) => {
  return (
    <button
      type="button"
      onClick={onVaciar}
      disabled={ocupado}
      aria-label="Vaciar carrito"
      title="Vaciar carrito"
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-solid border-red-400/40 bg-transparent p-0 text-red-400 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    </button>
  );
};

export default BotonVaciar;
