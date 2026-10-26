import { Link } from 'react-router-dom';




const FuncionCard = ({ id, horario, sala, idioma, formato, precio_base }) => {
  
  
  const hora = horario.slice(11, 16);

  return (
    <Link to={`/funcion/${id}/butacas`} className="funcion-card">
      <div className="funcion-card_arriba">
        <p>
          <span className="funcion-card_hora">{hora}</span>
          <span className="funcion-card_hs">hs</span>
        </p>
        <span className="funcion-card_formato">{formato}</span>
      </div>

      <p className="funcion-card_sala">{sala}</p>
      <p className="funcion-card_idioma">{idioma}</p>

      <p className="funcion-card_precio">${precio_base.toLocaleString('es-AR')}</p>
    </Link>
  );
};

export default FuncionCard;
