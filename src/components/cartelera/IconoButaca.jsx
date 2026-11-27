import './IconoButaca.css';

const Butaca = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7H6z" />
    <path d="M3 11a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <rect x="5" y="18" width="2" height="4" rx="1" />
    <rect x="17" y="18" width="2" height="4" rx="1" />
  </g>
);

const IconoButaca = ({ nivel, tamano = 14, decorativo = false }) => {
  const texto = `Disponibilidad ${nivel}`;

  return (
    <svg
      className={`icono-butaca icono-butaca--${nivel}`}
      width={(tamano * 38) / 24}
      height={tamano}
      viewBox="0 0 38 24"
      fill="currentColor"
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : texto}
      aria-hidden={decorativo ? 'true' : undefined}
    >
      {!decorativo && <title>{texto}</title>}
      <Butaca x={-3} />
      <Butaca x={17} />
    </svg>
  );
};

export default IconoButaca;
