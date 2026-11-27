import { Link } from 'react-router-dom';
import IconoButaca from '../cartelera/IconoButaca';




const FuncionCard = ({ id, horario, sala, idioma, formato, precio_base, disponibilidad }) => {


  const hora = horario.slice(11, 16);

  const contenido = (
    <>
      <div className="funcion-card_arriba">
        <p>
          <span className="funcion-card_hora">{hora}</span>
          <span className="funcion-card_hs">hs</span>
        </p>
        <span className="funcion-card_formato">{formato}</span>
      </div>

      <p className="funcion-card_sala">{sala}</p>
      <p className="funcion-card_idioma">{idioma}</p>

      <div className="funcion-card_abajo">
        <p className="funcion-card_precio">${precio_base.toLocaleString('es-AR')}</p>
        <p className="funcion-card_disp">
          {disponibilidad.nivel === 'agotada' ? 'Agotada' : <IconoButaca nivel={disponibilidad.nivel} tamano={16} />}
        </p>
      </div>
    </>
  );

  // Agotada: no es un Link, así no se puede entrar a elegir butacas.
  if (disponibilidad.nivel === 'agotada') {
    return (
      <div className="funcion-card funcion-card--agotada" aria-disabled="true">
        {contenido}
      </div>
    );
  }

  return (
    <Link to={`/funcion/${id}/butacas`} className="funcion-card">
      {contenido}
    </Link>
  );
};

export default FuncionCard;
