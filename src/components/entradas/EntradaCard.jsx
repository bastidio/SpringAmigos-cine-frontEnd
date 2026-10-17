const EntradaCard = ({ entrada, formatearFecha, formatearMoneda }) => {
  return (
    <article className="entrada-card">
      <div className="entrada-card__cabecera">
        <span className="etiqueta etiqueta--dorada">Confirmada</span>
        <span className="entrada-card__horario">
          {formatearFecha(entrada.horario)}
        </span>
      </div>

      <div className="entrada-card__cuerpo">
        <h2 className="entrada-card__pelicula">{entrada.pelicula}</h2>
        <p className="entrada-card__sala">Sala {entrada.sala || '—'}</p>
      </div>

      <hr className="entrada-card__separador" />

      <div className="entrada-card__datos">
        <div className="entrada-card__dato">
          <span className="entrada-card__etiqueta">Butaca</span>
          <strong className="entrada-card__valor">
            {entrada.fila ?? '—'}
            {entrada.numero ?? ''}
          </strong>
        </div>

        <div className="entrada-card__dato">
          <span className="entrada-card__etiqueta">Entrada</span>
          <strong className="entrada-card__valor">#{entrada.id}</strong>
        </div>

        <div className="entrada-card__dato entrada-card__dato--derecha">
          <span className="entrada-card__etiqueta">Total</span>
          <strong className="entrada-card__precio">
            {formatearMoneda(entrada.precio)}
          </strong>
        </div>
      </div>
    </article>
  );
};

export default EntradaCard;