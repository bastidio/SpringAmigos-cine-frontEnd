import { useEffect, useState } from 'react';
import DiapositivaPelicula from './DiapositivaPelicula';
import CarruselControles from './CarruselControles';


const INTERVALO_MS = 6000;


const UMBRAL_ARRASTRE_PX = 50;




const CarruselDestacadas = ({ peliculas, verDetalle }) => {
  const [indice, setIndice] = useState(0);
  
  const [pausado, setPausado] = useState(false);
  
  
  const [inicioArrastre, setInicioArrastre] = useState(null);

  const cantidad = peliculas.length;

  
  
  
  
  useEffect(() => {
    if (pausado || cantidad <= 1) return;

    const temporizador = setTimeout(() => {
      setIndice((indice + 1) % cantidad);
    }, INTERVALO_MS);

    
    
    return () => clearTimeout(temporizador);
  }, [indice, pausado, cantidad]);

  if (cantidad === 0) return null;

  const anterior = () => {
    setIndice((indice - 1 + cantidad) % cantidad);
  };

  const siguiente = () => {
    setIndice((indice + 1) % cantidad);
  };

  
  
  
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
