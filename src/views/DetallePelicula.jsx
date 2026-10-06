import PeliculaDetalle from '../components/pelicula/PeliculaDetalle';

// Vista del detalle de una pelicula (URL "/pelicula/:id").
// Solo renderiza: la logica esta en PeliculaDetalle.
const DetallePelicula = () => {
  return (
    <section className="pagina">
      <PeliculaDetalle />
    </section>
  );
};

export default DetallePelicula;
