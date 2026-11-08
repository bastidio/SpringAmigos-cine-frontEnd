const PanelCheckout = ({ cantidadItems, total, formatearMoneda }) => {
  return (
    <aside className="checkout-panel">
      <h2 className="checkout-panel__titulo">Total de la operación</h2>

      <p className="checkout-panel__renglon">
        <span>Artículos</span>
        <span>{cantidadItems}</span>
      </p>

      <hr className="checkout-panel__separador" />

      <p className="checkout-panel__renglon checkout-panel__renglon--total">
        <span>Total</span>
        <span className="checkout-panel__total">{formatearMoneda(total)}</span>
      </p>
    </aside>
  );
};

export default PanelCheckout;
