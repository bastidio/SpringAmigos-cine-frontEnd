const PanelSeleccion = ({ elegidas, precio, quitar, irAlKiosco, irAlCarrito }) => {
  const sinSeleccion = elegidas.length === 0;

  return (
    <aside className="panel">
      <h2 className="panel_titulo">Tu selección</h2>

      {sinSeleccion ? (
        <p className="panel_vacio">Elegí tus butacas en el mapa</p>
      ) : (
        <>
          <ul className="panel_butacas">
            {elegidas.map((butaca) => (
              <li key={butaca.id} className="panel_butaca">
                {butaca.nombre}
                <button
                  type="button"
                  className="panel_quitar"
                  onClick={() => quitar(butaca)}
                  aria-label={'Quitar butaca ' + butaca.nombre}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <hr className="panel_separador" />

          <p className="panel_renglon">
            <span>
              {elegidas.length} {elegidas.length === 1 ? 'butaca' : 'butacas'}
            </span>
            <span>${precio.toLocaleString('es-AR')} c/u</span>
          </p>
          <p className="panel_renglon panel_renglon--total">
            <span>Total entradas</span>
            <span className="panel_total">${(elegidas.length * precio).toLocaleString('es-AR')}</span>
          </p>
        </>
      )}

      <button
        type="button"
        className="boton boton--primario panel_boton"
        onClick={irAlKiosco}
        disabled={sinSeleccion}
      >
        Continuar al kiosco
      </button>
      <button
        type="button"
        className="boton boton--secundario panel_boton panel_boton--chico"
        onClick={irAlCarrito}
        disabled={sinSeleccion}
      >
        Ir directo al carrito
      </button>
    </aside>
  );
};

export default PanelSeleccion;
