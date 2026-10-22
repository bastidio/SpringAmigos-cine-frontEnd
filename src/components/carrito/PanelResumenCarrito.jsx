// Componente "tonto": el resumen con la cantidad, el total y el boton para
// pagar. No navega solo: avisa al padre con onIrACheckout.
const PanelResumenCarrito = ({ cantidadArticulos, total, formatearMoneda, onIrACheckout, ocupado = false }) => {
  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-solid border-white/10 bg-[#16101f] p-4 text-white">
      <h2 className="m-0 font-serif text-lg font-bold text-white">Resumen</h2>

      <p className="m-0 flex justify-between text-sm text-gray-400">
        <span>Cantidad de artículos</span>
        <span>{cantidadArticulos}</span>
      </p>

      <hr className="m-0 border-0 border-t border-solid border-white/10" />

      <p className="m-0 flex justify-between text-base font-semibold">
        <span>Total estimado</span>
        <span className="text-amber-300">{formatearMoneda(total)}</span>
      </p>

      <button
        type="button"
        onClick={onIrACheckout}
        disabled={ocupado}
        className="cursor-pointer rounded-xl border-0 bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ocupado ? 'Guardando cambios...' : 'Ir a pagar'}
      </button>
    </aside>
  );
};

export default PanelResumenCarrito;
