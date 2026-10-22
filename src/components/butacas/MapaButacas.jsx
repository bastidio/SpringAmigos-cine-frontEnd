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
      <div className="mapa_pantalla">
        <div className="mapa_pantalla-luz" />
        <div className="mapa_pantalla-linea" />
        <p className="mapa_pantalla-texto">Pantalla</p>
      </div>

      <div className="mapa_filas">
        {filas.map((fila) => {
          const butacasDeLaFila = butacas.filter((butaca) => butaca.fila === fila);
          const mitad = Math.ceil(butacasDeLaFila.length / 2);

          return (
            <div key={fila} className="mapa_fila">
              <span className="mapa_letra">{fila}</span>

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

              <span className="mapa_letra mapa_letra--derecha">{fila}</span>
            </div>
          );
        })}
      </div>

      <div className="mapa_leyenda">
        <span className="mapa_leyenda-item">
          <span className="butaca butaca--libre" /> Libre
        </span>
        <span className="mapa_leyenda-item">
          <span className="butaca butaca--seleccionada" /> Seleccionada
        </span>
        <span className="mapa_leyenda-item">
          <span className="butaca butaca--ocupada" /> Ocupada
        </span>
      </div>
    </div>
  );
};

export default MapaButacas;
