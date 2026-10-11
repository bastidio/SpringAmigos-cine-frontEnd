// Componente "tonto": etiqueta chica con borde. La variante elige el color.
const COLORES = {
  violeta: 'border-violet-500 text-violet-400',
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
