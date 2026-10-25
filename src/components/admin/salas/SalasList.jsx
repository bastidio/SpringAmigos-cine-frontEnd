import { butacasTotales } from './calculoButacas';

const textoDeFilas = (sala, asientos, estadoAsientos) => {
  if (estadoAsientos !== 'listo') return null;

  const filas = new Set(
    asientos.filter((asiento) => asiento.sala?.id === sala.id).map((asiento) => asiento.fila)
  );
  if (filas.size === 0) return 'Sin butacas cargadas';
  return filas.size === 1 ? '1 fila' : `${filas.size} filas`;
};

const SalasList = ({ salas, salaActiva, onSeleccionar, asientos, estadoAsientos }) => {
  if (salas.length === 0) return <p className="texto-muted">No hay salas cargadas.</p>;

  return (
    <div className="salas-lista">
      {salas.map((sala) => {
        const filas = textoDeFilas(sala, asientos, estadoAsientos);
        const totales = butacasTotales(sala, asientos, estadoAsientos);

        return (
          <button
            key={sala.id}
            type="button"
            className={`tarjeta-sala ${salaActiva?.id === sala.id ? 'activa' : ''}`}
            onClick={() => onSeleccionar(sala)}
          >
            <h3 className="tarjeta-sala-titulo">{sala.nombre}</h3>
            {totales !== null && <p className="tarjeta-sala-detalle">{totales} butacas totales</p>}
            {filas !== null && <p className="tarjeta-sala-filas">{filas}</p>}
          </button>
        );
      })}
    </div>
  );
};

export default SalasList;