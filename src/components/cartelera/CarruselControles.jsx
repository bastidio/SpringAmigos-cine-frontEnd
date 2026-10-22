// Componente "tonto": los puntitos dorados de abajo del carrusel, uno por
// pelicula. No sabe cual es la siguiente: solo avisa al padre con onIrA.
const CarruselControles = ({ cantidad, indice, onIrA }) => {
  return (
    // El activo es mas largo y dorado lleno; los otros, dorado transparente.
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
  );
};

export default CarruselControles;
