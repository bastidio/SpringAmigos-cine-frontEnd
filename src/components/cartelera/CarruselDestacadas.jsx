import { useEffect, useState } from 'react';
import DiapositivaPelicula from './DiapositivaPelicula';
import CarruselControles from './CarruselControles';


const INTERVALO_MS = 6000;


const CarruselDestacadas = ({ peliculas }) => {
  const [indice, setIndice] = useState(0);
  
  const [pausado, setPausado] = useState(false);

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

  const moverConTeclado = (evento) => {
    if (evento.key === 'ArrowLeft') anterior();
    if (evento.key === 'ArrowRight') siguiente();
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Películas destacadas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onKeyDown={moverConTeclado}
      className="relative h-[70vh] min-h-[480px] overflow-hidden"
    >
      {peliculas.map((pelicula, posicion) => (
        <DiapositivaPelicula
          key={pelicula.id}
          pelicula={pelicula}
          activa={posicion === indice}
          posicion={posicion + 1}
          total={cantidad}
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
