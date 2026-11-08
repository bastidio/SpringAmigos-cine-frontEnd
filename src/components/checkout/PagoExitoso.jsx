// Animacion de confirmacion: un circulo y un tilde que se dibujan en dorado.
const PagoExitoso = () => {
  return (
    <div className="checkout-exito" role="status">
      <svg className="checkout-exito__icono" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="checkout-exito__circulo" cx="60" cy="60" r="54" />
        <path className="checkout-exito__tilde" d="M36 62 L54 80 L86 44" />
      </svg>
      <p className="checkout-exito__texto">Compra confirmada</p>
    </div>
  );
};

export default PagoExitoso;
