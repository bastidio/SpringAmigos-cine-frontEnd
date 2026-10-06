// Componente "tonto": la tarjeta de UNA funcion (hora, sala, idioma,
// formato y precio). PeliculaDetalle la renderiza una vez por funcion.
const FuncionCard = ({ horario, sala, idioma, formato, precio_base }) => {
  // El back manda el horario como texto: "2026-10-21T14:30:00".
  // slice corta un pedazo del texto sin modificar el original: aca, "14:30".
  const hora = horario.slice(11, 16);

  return (
    <article className="funcion-card">
      <div className="funcion-card__arriba">
        <p>
          <span className="funcion-card__hora">{hora}</span>
          <span className="funcion-card__hs">hs</span>
        </p>
        <span className="funcion-card__formato">{formato}</span>
      </div>

      <p className="funcion-card__sala">{sala}</p>
      <p className="funcion-card__idioma">{idioma}</p>

      <p className="funcion-card__precio">${precio_base.toLocaleString('es-AR')}</p>
    </article>
  );
};

export default FuncionCard;
