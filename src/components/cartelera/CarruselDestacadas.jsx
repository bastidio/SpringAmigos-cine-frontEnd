import { useEffect, useState } from 'react';
import DiapositivaPelicula from './DiapositivaPelicula';
import CarruselControles from './CarruselControles';

// Cada cuanto pasa sola a la pelicula siguiente.
const INTERVALO_MS = 6000;
// Cuanto hay que arrastrar (en pixeles) para cambiar de pelicula. Menos que
// eso se toma como un click.
const UMBRAL_ARRASTRE_PX = 50;

// Componente padre del carrusel: es el unico que tiene estado. Sabe cual
// pelicula se ve (indice) y si esta en pausa; las diapositivas y los
// controles solo reciben props. Las peliculas se las pasa PeliculaList.
const CarruselDestacadas = ({ peliculas, verDetalle }) => {
  const [indice, setIndice] = useState(0);
  // Con el mouse encima el carrusel no avanza solo, para poder leer.
  const [pausado, setPausado] = useState(false);
  // Posicion X donde se apreto el mouse (o el dedo) para arrastrar.
  // null = no se esta arrastrando.
  const [inicioArrastre, setInicioArrastre] = useState(null);

  const cantidad = peliculas.length;

  // MONTAJE: arranca el temporizador para pasar a la siguiente.
  // ACTUALIZACION: cada vez que cambia indice (solo o con las flechas) o se
  // pausa/reanuda, el efecto vuelve a correr: el temporizador anterior se
  // cancela y arranca uno nuevo, asi siempre se cuentan 6 segundos enteros.
  useEffect(() => {
    if (pausado || cantidad <= 1) return;

    const temporizador = setTimeout(() => {
      setIndice((indice + 1) % cantidad);
    }, INTERVALO_MS);

    // DESMONTAJE (o antes de cada actualizacion): se cancela el temporizador,
    // asi no queda corriendo si el usuario se va de la cartelera.
    return () => clearTimeout(temporizador);
  }, [indice, pausado, cantidad]);

  if (cantidad === 0) return null;

  const anterior = () => {
    setIndice((indice - 1 + cantidad) % cantidad);
  };

  const siguiente = () => {
    setIndice((indice + 1) % cantidad);
  };

  // Arrastrar con el mouse o el dedo (pointer = los dos): se guarda donde
  // empezo y, al soltar, segun para que lado se movio se pasa a la anterior o
  // a la siguiente. Solo el boton principal del mouse.
  const empezarArrastre = (evento) => {
    if (evento.button !== 0) return;
    setInicioArrastre(evento.clientX);
  };

  const terminarArrastre = (evento) => {
    if (inicioArrastre === null) return;
    const distancia = evento.clientX - inicioArrastre;
    setInicioArrastre(null);

    if (distancia > UMBRAL_ARRASTRE_PX) anterior();
    if (distancia < -UMBRAL_ARRASTRE_PX) siguiente();
  };

  const cancelarArrastre = () => {
    setInicioArrastre(null);
  };

  // Con el foco adentro del carrusel, las flechas del teclado tambien lo mueven.
  const moverConTeclado = (evento) => {
    if (evento.key === 'ArrowLeft') anterior();
    if (evento.key === 'ArrowRight') siguiente();
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Películas destacadas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => {
        setPausado(false);
        cancelarArrastre();
      }}
      onPointerDown={empezarArrastre}
      onPointerUp={terminarArrastre}
      onPointerCancel={cancelarArrastre}
      onKeyDown={moverConTeclado}
      // touch-pan-y: en el celular el dedo sigue pudiendo scrollear la pagina
      // para abajo; solo el movimiento de costado mueve el carrusel.
      // select-none: arrastrar no selecciona el texto.
      className={`relative h-[70vh] min-h-[480px] touch-pan-y select-none overflow-hidden ${
        inicioArrastre === null ? 'cursor-grab' : 'cursor-grabbing'
      }`}
    >
      {peliculas.map((pelicula, posicion) => (
        <DiapositivaPelicula
          key={pelicula.id}
          pelicula={pelicula}
          activa={posicion === indice}
          posicion={posicion + 1}
          total={cantidad}
          verDetalle={verDetalle}
        />
      ))}

      {cantidad > 1 && (
        <CarruselControles
          cantidad={cantidad}
          indice={indice}
          onAnterior={anterior}
          onSiguiente={siguiente}
          onIrA={setIndice}
        />
      )}
    </section>
  );
};

export default CarruselDestacadas;
