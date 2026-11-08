
const COLORES = {
  violeta: 'border-[var(--morado-texto)] text-[var(--morado-texto)]',
  dorado: 'border-amber-400 text-amber-300',
};

const Badge = ({ texto, variante = 'violeta' }) => {
  return (
    <span
      className={`inline-block rounded-full border border-solid px-3 py-1 text-[11px] font-semibold tracking-widest ${COLORES[variante]}`}
    >
      {texto}
    </span>
  );
};

export default Badge;
