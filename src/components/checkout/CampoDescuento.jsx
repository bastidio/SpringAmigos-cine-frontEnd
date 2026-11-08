import { useState } from 'react';

// Campo "Codigo de descuento". Solo captura el texto: validar y calcular lo hace el padre contra el backend.
const CampoDescuento = ({ codigoAplicado, cargando, error, onAplicar, onQuitar }) => {
  const [texto, setTexto] = useState('');
  const aplicado = codigoAplicado !== null;

  const aplicar = (evento) => {
    evento.preventDefault();
    if (texto.trim() !== '' && !cargando) onAplicar(texto.trim());
  };

  const quitar = () => {
    setTexto('');
    onQuitar();
  };

  return (
    <form className="checkout-descuento" onSubmit={aplicar}>
      <label className="checkout-pago__etiqueta" htmlFor="codigo-descuento">
        Código de descuento
      </label>
      <div className="checkout-descuento__fila">
        <input
          id="codigo-descuento"
          className={`checkout-pago__input${error !== null ? ' checkout-pago__input--invalido' : ''}`}
          type="text"
          autoComplete="off"
          placeholder="Ej: VERANO20"
          value={aplicado ? codigoAplicado : texto}
          onChange={(evento) => setTexto(evento.target.value)}
          disabled={aplicado}
          aria-invalid={error !== null}
          aria-describedby={error !== null ? 'codigo-descuento-error' : undefined}
        />
        {aplicado ? (
          <button type="button" className="boton boton--secundario" onClick={quitar}>
            Quitar
          </button>
        ) : (
          <button
            type="submit"
            className="boton boton--secundario"
            disabled={texto.trim() === '' || cargando}
          >
            {cargando ? 'Aplicando...' : 'Aplicar'}
          </button>
        )}
      </div>
      {error !== null && (
        <p id="codigo-descuento-error" role="alert" className="checkout-pago__error">
          {error}
        </p>
      )}
    </form>
  );
};

export default CampoDescuento;
