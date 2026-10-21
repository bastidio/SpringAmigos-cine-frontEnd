// Botones del final: ir a mis entradas y cerrar sesion. Las acciones las
// decide el padre.
function ProfileActions({ onMisEntradas, onCerrarSesion }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" className="boton boton--secundario w-full" onClick={onMisEntradas}>
        <span aria-hidden="true">🎟️</span> Mis Entradas
      </button>
      <button
        type="button"
        className="boton w-full border border-[var(--error)] bg-transparent font-medium text-[var(--error)] hover:bg-[rgba(248,113,113,0.1)]"
        onClick={onCerrarSesion}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default ProfileActions;
