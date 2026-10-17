import { Link } from 'react-router-dom';

const OrdenConfirmada = ({ orden, formatearMoneda, irAMisEntradas }) => {
  const cantidadEntradas = orden.entradas?.length ?? 0;

  return (
    <div className="checkout-confirmada">
      <span className="etiqueta etiqueta--dorada">Compra confirmada</span>
      <h1 className="checkout-confirmada__titulo">¡Gracias por tu compra!</h1>
      <p className="checkout-confirmada__subtitulo">
        Tu orden <strong>#{orden.id}</strong> se registró correctamente.
      </p>

      <hr className="checkout-confirmada__separador" />

      <div className="checkout-confirmada__resumen">
        <span>Total abonado</span>
        <strong className="checkout-confirmada__total">
          {formatearMoneda(orden.total)}
        </strong>
      </div>

      {cantidadEntradas > 0 && (
        <p className="checkout-confirmada__nota">
          Se generaron {cantidadEntradas}{' '}
          {cantidadEntradas === 1 ? 'entrada' : 'entradas'}.
        </p>
      )}

      <div className="checkout-confirmada__acciones">
        <button
          type="button"
          className="boton boton--primario"
          onClick={irAMisEntradas}
        >
          Ver mis entradas
        </button>
        <Link className="boton boton--secundario" to="/">
          Volver a cartelera
        </Link>
      </div>
    </div>
  );
};

export default OrdenConfirmada;