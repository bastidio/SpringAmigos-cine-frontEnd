// Tarjeta que se completa en vivo. Solo muestra lo que recibe por props.
// Al enfocar el codigo de seguridad (girada) se da vuelta y muestra el dorso.
const TarjetaVisual = ({ numero, titular, vencimiento, codigo, marca, girada }) => {
  const plantilla = marca === 'Amex' ? '•••• •••••• •••••' : '•••• •••• •••• ••••';

  return (
    <div className="checkout-tarjeta" aria-hidden="true">
      <div
        className={`checkout-tarjeta__interior${girada ? ' checkout-tarjeta__interior--girada' : ''}`}
      >
        <div className="checkout-tarjeta__cara checkout-tarjeta__frente">
          <div className="checkout-tarjeta__superior">
            <span className="checkout-tarjeta__chip" />
            <span className="checkout-tarjeta__marca">{marca ?? ''}</span>
          </div>

          <p className="checkout-tarjeta__numero">{numero + plantilla.slice(numero.length)}</p>

          <div className="checkout-tarjeta__inferior">
            <div className="checkout-tarjeta__dato">
              <span className="checkout-tarjeta__rotulo">Titular</span>
              <span className="checkout-tarjeta__valor">
                {titular.trim() === '' ? 'NOMBRE Y APELLIDO' : titular.toUpperCase()}
              </span>
            </div>
            <div className="checkout-tarjeta__dato">
              <span className="checkout-tarjeta__rotulo">Vence</span>
              <span className="checkout-tarjeta__valor">{vencimiento === '' ? 'MM/AA' : vencimiento}</span>
            </div>
          </div>
        </div>

        <div className="checkout-tarjeta__cara checkout-tarjeta__dorso">
          <span className="checkout-tarjeta__banda" />
          <div className="checkout-tarjeta__firma">
            <span className="checkout-tarjeta__rotulo">Código de seguridad</span>
            <span className="checkout-tarjeta__codigo">{codigo === '' ? '•••' : codigo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetaVisual;
