import ProductoList from '../components/kiosco/ProductoList';
import CarritoDetalle from '../components/carrito/CarritoDetalle';

const Kiosco = ({ haySesion, irA }) => {
  return (
    <section className="pagina">
      <div className="kiosco_layout">
        <div className="kiosco_productos">
          <ProductoList />
        </div>

        <aside className="kiosco_carrito" aria-label="Tu carrito">
          <h2 className="kiosco_carrito-titulo">Tu carrito</h2>
          {!haySesion ? (
            <div className="kiosco_carrito-login">
              <p>Iniciá sesión para armar tu carrito.</p>
              <button type="button" className="boton boton--primario" onClick={() => irA('/login')}>
                Iniciar sesión
              </button>
            </div>
          ) : (
            <CarritoDetalle irA={irA} />
          )}
        </aside>
      </div>
    </section>
  );
};

export default Kiosco;
