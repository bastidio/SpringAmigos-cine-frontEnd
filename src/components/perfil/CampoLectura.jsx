

const CampoLectura = ({ id, etiqueta, valor }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-etiqueta`} className="text-[11px] font-semibold tracking-widest text-gray-400">
        {etiqueta}
      </span>
      <p
        id={id}
        aria-labelledby={`${id}-etiqueta`}
        className="w-full cursor-default break-words rounded-lg border border-solid border-white/10 bg-[var(--fondo)] px-3 py-2.5 text-sm text-white"
      >
        {valor}
      </p>
    </div>
  );
};

export default CampoLectura;
