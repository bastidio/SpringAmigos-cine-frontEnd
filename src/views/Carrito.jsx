import CarritoDetalle from '../components/carrito/CarritoDetalle';

// Pagina /carrito. Queda mientras haya links que mandan aca (butacas,
// checkout, entradas, footer); el carrito principal es el desplegable del nav
// (CarritoView). Solo renderiza: la logica esta en CarritoDetalle.
const Carrito = ({ token, onNavegar }) => {
  return (
    <section className="pagina">
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-10 text-white">
        <h1 className="m-0 font-serif text-4xl font-bold text-white">Carrito</h1>
        <CarritoDetalle token={token} onNavegar={onNavegar} />
      </div>
    </section>
  );
};

export default Carrito;
