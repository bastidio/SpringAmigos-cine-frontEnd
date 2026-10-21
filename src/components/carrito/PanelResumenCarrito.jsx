import { Link } from 'react-router-dom';

const PanelResumenCarrito = ({ cantidadArticulos, total, formatearMoneda }) => {
  return (
    <aside className="carrito-panel">
      <h2 className="carrito-panel__titulo">Resumen</h2>

      <p className="carrito-panel__renglon">
        <span>Cantidad de artículos</span>
        <span>{cantidadArticulos}</span>
      </p>

      <hr className="carrito-panel__separador" />

      <p className="carrito-panel__renglon carrito-panel__renglon--total">
        <span>Total estimado</span>
        <span className="carrito-panel__total">{formatearMoneda(total)}</span>
      </p>

      <Link className="boton boton--primario carrito-panel__boton" to="/checkout">
        Continuar al checkout
      </Link>
    </aside>
  );
};

export default PanelResumenCarrito;