const PanelCheckout = ({ cantidadItems, total, descuento, formatearMoneda, children }) => {
  return (
    <aside className="checkout-panel">
      <h2 className="checkout-panel__titulo">Total de la operación</h2>

      <p className="checkout-panel__renglon">
        <span>Artículos</span>
        <span>{cantidadItems}</span>
      </p>

      {children}

      <hr className="checkout-panel__separador" />

      {descuento !== null && (
        <>
          <p className="checkout-panel__renglon">
            <span>Subtotal</span>
            <span>{formatearMoneda(descuento.subtotal)}</span>
          </p>
          <p className="checkout-panel__renglon">
            <span>
              Descuento ({descuento.codigo} −{descuento.porcentaje}%)
            </span>
            <span>−{formatearMoneda(descuento.montoDescuento)}</span>
          </p>
        </>
      )}

      <p className="checkout-panel__renglon checkout-panel__renglon--total">
        <span>Total</span>
        <span className="checkout-panel__total">
          {formatearMoneda(descuento !== null ? descuento.total : total)}
        </span>
      </p>
    </aside>
  );
};

export default PanelCheckout;
