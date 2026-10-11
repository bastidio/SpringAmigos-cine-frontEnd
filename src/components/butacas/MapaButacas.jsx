const MapaButacas = ({ butacas, seleccionadas, alternar }) => {
  const filas = [...new Set(butacas.map((butaca) => butaca.fila))];

  const claseDe = (butaca) => {
    if (seleccionadas.includes(butaca.id)) {
      return 'butaca butaca--seleccionada';
    }
    if (butaca.estado === 'OCUPADA') {
      return 'butaca butaca--ocupada';
    }
    return 'butaca butaca--libre';
  };

  return (
    <div className="mapa">
      <div className="mapa__pantalla">
        <div className="mapa__pantalla-luz" />
        <div className="mapa__pantalla-linea" />
        <p className="mapa__pantalla-texto">Pantalla</p>
      </div>

      <div className="mapa__filas">
        {filas.map((fila) => {
          const butacasDeLaFila = butacas.filter((butaca) => butaca.fila === fila);
          const mitad = Math.ceil(butacasDeLaFila.length / 2);

          return (
            <div key={fila} className="mapa__fila">
              <span className="mapa__letra">{fila}</span>

              {butacasDeLaFila.map((butaca, i) => (
                <button
                  key={butaca.id}
                  type="button"
                  className={claseDe(butaca) + (i === mitad ? ' butaca--pasillo' : '')}
                  onClick={() => alternar(butaca)}
                  disabled={butaca.estado === 'OCUPADA'}
                  aria-pressed={seleccionadas.includes(butaca.id)}
                  aria-label={
                    'Butaca ' + butaca.nombre + (butaca.estado === 'OCUPADA' ? ' (ocupada)' : '')
                  }
                  title={butaca.nombre}
                />
              ))}

              <span className="mapa__letra mapa__letra--derecha">{fila}</span>
            </div>
          );
        })}
      </div>

      <div className="mapa__leyenda">
        <span className="mapa__leyenda-item">
          <span className="butaca butaca--libre butaca--muestra" /> Libre
        </span>
        <span className="mapa__leyenda-item">
          <span className="butaca butaca--seleccionada butaca--muestra" /> Seleccionada
        </span>
        <span className="mapa__leyenda-item">
          <span className="butaca butaca--ocupada butaca--muestra" /> Ocupada
        </span>
      </div>
    </div>
  );
};

export default MapaButacas;
