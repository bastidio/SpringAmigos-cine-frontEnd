const letraDeFila = (fila) => String.fromCharCode(64 + fila);

const MapaSala = ({ asientos, capacidad, estado }) => {
  if (estado === 'cargando') {
    return <p className="mapa-sala_mensaje">Cargando mapa de butacas...</p>;
  }

  if (estado === 'error') {
    return (
      <p role="alert" className="mapa-sala_mensaje mapa-sala_mensaje--error">
        No se pudieron cargar las butacas. Revisá que el backend esté levantado.
      </p>
    );
  }

  if (asientos.length === 0) {
    return (
      <div className="mapa-sala_vacio">
        <p className="mapa-sala_vacio-titulo">Esta sala todavía no tiene butacas cargadas</p>
        <p>Su capacidad configurada es de {capacidad} butacas, pero no hay asientos creados para armar el mapa.</p>
      </div>
    );
  }

  const ordenados = [...asientos].sort((a, b) => a.fila - b.fila || a.numero - b.numero);
  const filas = [...new Set(ordenados.map((asiento) => asiento.fila))];

  return (
    <div className="mapa-sala">
      <div className="mapa-sala_resumen">
        <span className="mapa-sala_dato">
          <strong>{filas.length}</strong> {filas.length === 1 ? 'fila' : 'filas'}
        </span>
        <span className="mapa-sala_dato">
          <strong>{ordenados.length}</strong> {ordenados.length === 1 ? 'butaca' : 'butacas'}
        </span>
      </div>

      <div className="mapa-sala_pantalla">
        <div className="mapa-sala_pantalla-luz" />
        <div className="mapa-sala_pantalla-linea" />
        <p className="mapa-sala_pantalla-texto">Pantalla</p>
      </div>

      <div className="mapa-sala_filas">
        {filas.map((fila) => {
          const butacasDeLaFila = ordenados.filter((asiento) => asiento.fila === fila);
          const mitad = Math.ceil(butacasDeLaFila.length / 2);

          return (
            <div key={fila} className="mapa-sala_fila">
              <span className="mapa-sala_letra">{letraDeFila(fila)}</span>

              {butacasDeLaFila.map((asiento, i) => (
                <span
                  key={asiento.id}
                  className={'mapa-sala_butaca' + (i === mitad ? ' mapa-sala_butaca--pasillo' : '')}
                  title={letraDeFila(fila) + asiento.numero}
                  role="img"
                  aria-label={'Butaca ' + letraDeFila(fila) + asiento.numero}
                />
              ))}

              <span className="mapa-sala_letra">{letraDeFila(fila)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapaSala;
