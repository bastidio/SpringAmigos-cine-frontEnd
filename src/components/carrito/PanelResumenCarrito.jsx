

const PanelResumenCarrito = ({ cantidadArticulos, total, formatearMoneda, onIrACheckout, ocupado = false }) => {
  return (
    <aside className="flex flex-col gap-2 rounded-xl border border-solid border-white/10 bg-[var(--superficie)] p-3 text-white">
      <h2 className="m-0 font-serif text-base font-bold text-white">Resumen</h2>

      <p className="m-0 flex justify-between text-xs text-gray-400">
        <span>Cantidad de artículos</span>
        <span>{cantidadArticulos}</span>
      </p>

      <hr className="m-0 border-0 border-t border-solid border-white/10" />

      <p className="m-0 flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span className="text-amber-300">{formatearMoneda(total)}</span>
      </p>

      <button
        type="button"
        onClick={onIrACheckout}
        disabled={ocupado}
        className="cursor-pointer rounded-lg border-0 bg-[var(--morado)] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--morado-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ocupado ? 'Guardando cambios...' : 'Continuar'}
      </button>
    </aside>
  );
};

export default PanelResumenCarrito;
