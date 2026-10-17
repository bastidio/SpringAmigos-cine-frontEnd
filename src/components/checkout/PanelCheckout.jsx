const PanelCheckout = ({
  cantidadItems,
  total,
  confirmando,
  deshabilitado,
  onConfirmar,
  formatearMoneda,
}) => {
  return (
    <aside className="checkout-panel">
      <h2 className="checkout-panel__titulo">Total de la operación</h2>

      <p className="checkout-panel__renglon">
        <span>Artículos</span>
        <span>{cantidadItems}</span>
      </p>

      <hr className="checkout-panel__separador" />

      <p className="checkout-panel__renglon checkout-panel__renglon--total">
        <span>Total estimado</span>
        <span className="checkout-panel__total">{formatearMoneda(total)}</span>
      </p>

      <p className="checkout-panel__nota">
        Al confirmar, el servidor volverá a validar la disponibilidad y el
        importe de la operación.
      </p>

      <button
        type="button"
        className="boton boton--primario checkout-panel__boton"
        disabled={deshabilitado}
        onClick={onConfirmar}
      >
        {confirmando ? 'Procesando compra...' : 'Confirmar compra'}
      </button>

      <p className="checkout-panel__seguro">
        Pago seguro con encriptación SSL
      </p>
    </aside>
  );
};

export default PanelCheckout;