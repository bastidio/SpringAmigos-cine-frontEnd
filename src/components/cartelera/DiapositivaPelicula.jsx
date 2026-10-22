// Componente "tonto": una diapositiva del carrusel de la cartelera. Muestra
// una pelicula con su poster de fondo. Todas las diapositivas estan apiladas;
// la activa se ve (opacity-100) y las otras quedan transparentes. Si esta
// activa o no, se lo dice el padre por props.
const DiapositivaPelicula = ({ pelicula, activa, posicion, total, verDetalle }) => {
  // Los botones de las diapositivas ocultas no se alcanzan con Tab.
  const tabIndex = activa ? 0 : -1;

  return (
    <article
      aria-roledescription="diapositiva"
      aria-label={`${posicion} de ${total}: ${pelicula.titulo}`}
      aria-hidden={!activa}
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
        activa ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {pelicula.poster_url && (
        // draggable={false}: si no, al arrastrar el carrusel el navegador
        // "levanta" la imagen en vez de mover las peliculas.
        <img
          src={pelicula.poster_url}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Dos velos sobre la imagen: uno oscurece la izquierda para que el texto
          se lea, el otro funde el borde de abajo con el fondo de la pagina. */}
      <div className="absolute inset-0 bg-linear-to-r from-[rgba(11,7,16,0.95)] via-[rgba(11,7,16,0.6)] to-[rgba(11,7,16,0.2)]" />
      <div className="absolute inset-0 bg-linear-to-t from-[var(--fondo)] to-transparent to-40%" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col justify-center px-20 max-md:px-6">
        <div className="max-w-xl">
          <h2 className="mb-4 text-6xl font-bold leading-tight text-[var(--texto)] [font-family:var(--titulos)] max-md:text-4xl">
            {pelicula.titulo}
          </h2>

          <p className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--texto-suave)]">
            {/* Clasificacion por edad, en dorado. */}
            <span className="rounded border border-solid border-[var(--dorado)]/30 bg-[var(--dorado)]/12 px-2.5 py-0.5 text-[11.2px] font-bold uppercase tracking-wider text-[var(--dorado)]">
              {pelicula.clasificacion}
            </span>
            <span>{pelicula.duracion} min</span>
            <span>{pelicula.idioma}</span>
          </p>

          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--texto-suave)]">
            {pelicula.sinopsis}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              tabIndex={tabIndex}
              onClick={() => verDetalle(pelicula.id)}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-linear-135 from-[var(--morado)] to-[#6d28d9] px-6 py-3 text-[14.4px] font-semibold text-[var(--texto)] transition-all hover:-translate-y-px hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--morado)]"
            >
              Ver funciones
            </button>
            <button
              type="button"
              tabIndex={tabIndex}
              onClick={() => verDetalle(pelicula.id)}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-solid border-[var(--morado)] bg-transparent px-6 py-3 text-[14.4px] font-medium text-[var(--morado)] transition-all hover:bg-[var(--morado)]/10 hover:shadow-[0_0_16px_rgba(139,92,246,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--morado)]"
            >
              Más información
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DiapositivaPelicula;
