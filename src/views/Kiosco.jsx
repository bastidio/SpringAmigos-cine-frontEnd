import { useNavigate } from 'react-router-dom';
import ProductoList from '../components/kiosco/ProductoList';
import CarritoDetalle from '../components/carrito/CarritoDetalle';

// Productos a la izquierda y carrito en vivo a la derecha: el boton "Continuar"
// del carrito lleva directo al checkout.
const Kiosco = ({ token }) => {
  const navigate = useNavigate();

  return (
    <section className="pagina">
      <div className="kiosco_layout">
        <div className="kiosco_productos">
          <ProductoList token={token} />
        </div>

        <aside className="kiosco_carrito" aria-label="Tu carrito">
          <h2 className="kiosco_carrito-titulo">Tu carrito</h2>
          {token === '' ? (
            <div className="kiosco_carrito-login">
              <p>Iniciá sesión para armar tu carrito.</p>
              <button type="button" className="boton boton--primario" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
            </div>
          ) : (
            <CarritoDetalle token={token} onNavegar={navigate} />
          )}
        </aside>
      </div>
    </section>
  );
};

export default Kiosco;
