// Componente "tonto": un dato del usuario con su etiqueta. El input es
// readOnly: se puede seleccionar y copiar, pero no editar.
const CampoLectura = ({ id, etiqueta, valor }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold tracking-widest text-gray-400">
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        readOnly
        className="w-full rounded-lg border border-solid border-white/10 bg-[#0b0910] px-3 py-2.5 text-sm text-white outline-none"
      />
    </div>
  );
};

export default CampoLectura;
