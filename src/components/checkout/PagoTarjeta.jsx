import { useState } from 'react';
import TarjetaVisual from './TarjetaVisual';
import {
  errorCodigo,
  errorNumero,
  errorTitular,
  errorVencimiento,
  formatearNumero,
  formatearVencimiento,
  marcaDe,
  soloDigitos,
} from './validacionesTarjeta';

const Campo = ({ id, etiqueta, error, ancho = false, children }) => (
  <div className={`checkout-pago__campo${ancho ? ' checkout-pago__campo--ancho' : ''}`}>
    <label className="checkout-pago__etiqueta" htmlFor={id}>
      {etiqueta}
    </label>
    {children}
    {error !== '' && (
      <p id={`${id}-error`} className="checkout-pago__error">
        {error}
      </p>
    )}
  </div>
);

// Pago con tarjeta SIMULADO. Los datos viven solo en el estado de este componente:
// no se envian al backend, no se guardan en ningun lado y no se muestran en consola.
// Al pagar, solo se avisa con onPagar() (sin datos); el padre llama al checkout.
const PagoTarjeta = ({ total, formatearMoneda, pagando, bloqueado, onPagar }) => {
  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [codigo, setCodigo] = useState('');
  const [girada, setGirada] = useState(false);
  const [tocados, setTocados] = useState({});

  const marca = marcaDe(soloDigitos(numero));
  const errores = {
    numero: errorNumero(numero),
    titular: errorTitular(titular),
    vencimiento: errorVencimiento(vencimiento),
    codigo: errorCodigo(codigo, marca),
  };
  const valido = Object.values(errores).every((error) => error === '');

  // El error de un campo se muestra recien cuando el usuario ya pasó por él.
  const tocar = (campo) => setTocados({ ...tocados, [campo]: true });
  const errorVisible = (campo) => (tocados[campo] ? errores[campo] : '');
  const claseInput = (campo) =>
    `checkout-pago__input${errorVisible(campo) !== '' ? ' checkout-pago__input--invalido' : ''}`;

  const pagar = (evento) => {
    evento.preventDefault();
    if (valido && !bloqueado && !pagando) onPagar();
  };

  return (
    <section className="checkout-pago" aria-label="Pago con tarjeta">
      <form className="checkout-pago__formulario" onSubmit={pagar} noValidate>
        <h2 className="checkout-pago__titulo">Pago con tarjeta</h2>

        <Campo id="tarjeta-numero" etiqueta="Número de tarjeta" error={errorVisible('numero')} ancho>
          <input
            id="tarjeta-numero"
            className={claseInput('numero')}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={numero}
            onChange={(evento) => setNumero(formatearNumero(evento.target.value))}
            onBlur={() => tocar('numero')}
            aria-invalid={errorVisible('numero') !== ''}
            aria-describedby={errorVisible('numero') !== '' ? 'tarjeta-numero-error' : undefined}
          />
        </Campo>

        <Campo id="tarjeta-titular" etiqueta="Nombre del titular" error={errorVisible('titular')} ancho>
          <input
            id="tarjeta-titular"
            className={claseInput('titular')}
            type="text"
            autoComplete="cc-name"
            placeholder="Como figura en la tarjeta"
            value={titular}
            onChange={(evento) => setTitular(evento.target.value)}
            onBlur={() => tocar('titular')}
            aria-invalid={errorVisible('titular') !== ''}
            aria-describedby={errorVisible('titular') !== '' ? 'tarjeta-titular-error' : undefined}
          />
        </Campo>

        <Campo id="tarjeta-vencimiento" etiqueta="Vencimiento" error={errorVisible('vencimiento')}>
          <input
            id="tarjeta-vencimiento"
            className={claseInput('vencimiento')}
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            maxLength={5}
            value={vencimiento}
            onChange={(evento) => setVencimiento(formatearVencimiento(evento.target.value))}
            onBlur={() => tocar('vencimiento')}
            aria-invalid={errorVisible('vencimiento') !== ''}
            aria-describedby={errorVisible('vencimiento') !== '' ? 'tarjeta-vencimiento-error' : undefined}
          />
        </Campo>

        <Campo id="tarjeta-codigo" etiqueta="Código de seguridad" error={errorVisible('codigo')}>
          <input
            id="tarjeta-codigo"
            className={claseInput('codigo')}
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={marca === 'Amex' ? '4 dígitos' : '3 dígitos'}
            maxLength={marca === 'Amex' ? 4 : 3}
            value={codigo}
            onChange={(evento) => setCodigo(soloDigitos(evento.target.value))}
            onFocus={() => setGirada(true)}
            onBlur={() => {
              setGirada(false);
              tocar('codigo');
            }}
            aria-invalid={errorVisible('codigo') !== ''}
            aria-describedby={errorVisible('codigo') !== '' ? 'tarjeta-codigo-error' : undefined}
          />
        </Campo>

        <button
          type="submit"
          className="boton boton--primario checkout-pago__boton"
          disabled={!valido || bloqueado || pagando}
        >
          {pagando ? 'Procesando compra...' : `Pagar ${formatearMoneda(total)}`}
        </button>

        <p className="checkout-pago__nota">
          Pago simulado: los datos de la tarjeta no se envían ni se guardan. Al pagar, el servidor
          vuelve a validar la disponibilidad y el importe.
        </p>
      </form>

      <TarjetaVisual
        numero={numero}
        titular={titular}
        vencimiento={vencimiento}
        codigo={codigo}
        marca={marca}
        girada={girada}
      />
    </section>
  );
};

export default PagoTarjeta;
