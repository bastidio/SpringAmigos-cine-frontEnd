// Componente "tonto": los controles del carrusel. No sabe cual es la
// siguiente pelicula: solo avisa al padre con callbacks.
// - Flechas doradas: estan escondidas y aparecen cuando el mouse llega al borde
//   izquierdo o derecho (una franja invisible con "group"; al pasar por encima,
//   group-hover muestra la flecha). Todo con clases de Tailwind, sin estado.
//   En celular no hay mouse: no se muestran y se usa el dedo para arrastrar.
// - Puntitos dorados abajo, uno por pelicula.
const claseBorde = 'group absolute inset-y-0 z-20 flex items-center max-md:hidden';

const claseFlecha =
  'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-solid border-[var(--dorado)]/50 bg-[var(--fondo)]/60 p-0 text-[var(--dorado)] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-[var(--dorado)]/20 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dorado)]';

const Flecha = ({ direccion }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d={direccion === 'izquierda' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

const CarruselControles = ({ cantidad, indice, onAnterior, onSiguiente, onIrA }) => {
  return (
    <>
      {/* Borde izquierdo: w-20 para no tapar el texto de la pelicula, que
          empieza despues de ese margen. */}
      <div className={`${claseBorde} left-0 w-20 justify-center`}>
        <button type="button" onClick={onAnterior} aria-label="Película anterior" className={claseFlecha}>
          <Flecha direccion="izquierda" />
        </button>
      </div>

      <div className={`${claseBorde} right-0 w-28 justify-center`}>
        <button type="button" onClick={onSiguiente} aria-label="Película siguiente" className={claseFlecha}>
          <Flecha direccion="derecha" />
        </button>
      </div>

      {/* El activo es mas largo y dorado lleno; los otros, dorado transparente. */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {Array.from({ length: cantidad }, (_, posicion) => (
          <button
            key={posicion}
            type="button"
            onClick={() => onIrA(posicion)}
            aria-label={`Ir a la película ${posicion + 1}`}
            aria-current={posicion === indice}
            className={`h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dorado)] ${
              posicion === indice
                ? 'w-8 bg-[var(--dorado)]'
                : 'w-2 bg-[var(--dorado)]/35 hover:bg-[var(--dorado)]/70'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default CarruselControles;
