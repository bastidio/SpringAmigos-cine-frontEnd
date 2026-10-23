// Componente "tonto": ventana emergente para confirmar algo o avisar un error.
// Reemplaza a window.alert y window.confirm (no se usan en el proyecto).
// No decide nada: si se ve o no, el texto y que pasa al aceptar o cancelar se
// lo pasa el padre por props.
// - Con onCancelar: dos botones (confirmar / cancelar), como un confirm.
// - Sin onCancelar: un solo boton para cerrar, como un alert.
// Se cierra con Escape o tocando el fondo oscuro (si hay onCancelar, cancela;
// si no, confirma = "Entendido").
const COLORES = {
  peligro: {
    icono: 'bg-red-500/15 text-red-400',
    boton: 'bg-red-500 hover:bg-red-400 focus-visible:outline-red-400',
  },
  aviso: {
    icono: 'bg-[var(--dorado)]/15 text-[var(--dorado)]',
    boton: 'bg-[var(--morado)] hover:bg-violet-500 focus-visible:outline-[var(--morado)]',
  },
};

const VentanaEmergente = ({
  abierta,
  titulo,
  mensaje,
  variante = 'aviso',
  textoConfirmar = 'Entendido',
  textoCancelar = 'Cancelar',
  ocupado = false,
  onConfirmar,
  onCancelar,
}) => {
  if (!abierta) return null;

  const colores = COLORES[variante] ?? COLORES.aviso;
  const cerrar = onCancelar ?? onConfirmar;

  const cerrarConEscape = (evento) => {
    if (evento.key === 'Escape' && !ocupado) cerrar();
  };

  return (
    // Fondo oscuro: un click afuera de la caja cierra la ventana.
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={ocupado ? undefined : cerrar}
    >
      {/* stopPropagation: un click adentro de la caja no llega al fondo.
          tabIndex -1 + autoFocus: el foco entra a la caja al abrirse (lo hace
          React), asi funciona Escape. */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ventana-titulo"
        aria-describedby="ventana-mensaje"
        tabIndex={-1}
        autoFocus
        onClick={(evento) => evento.stopPropagation()}
        onKeyDown={cerrarConEscape}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-solid border-white/10 bg-[var(--superficie)] p-6 text-left text-[var(--texto)] shadow-2xl shadow-black/60 outline-none"
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${colores.icono}`}
            aria-hidden="true"
          >
            !
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="ventana-titulo" className="m-0 text-lg font-bold [font-family:var(--titulos)]">
              {titulo}
            </h2>
            <p id="ventana-mensaje" className="m-0 text-sm leading-relaxed text-[var(--texto-suave)]">
              {mensaje}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              disabled={ocupado}
              className="cursor-pointer rounded-lg border border-solid border-[var(--borde)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--texto)] transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--morado)]"
            >
              {textoCancelar}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirmar}
            disabled={ocupado}
            className={`cursor-pointer rounded-lg border-0 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 ${colores.boton}`}
          >
            {ocupado ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentanaEmergente;
