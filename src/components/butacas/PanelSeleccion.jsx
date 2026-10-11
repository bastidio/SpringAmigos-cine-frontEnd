const PanelSeleccion = ({ elegidas, precio, total, quitar, irAlKiosco, irAlCarrito }) => {
  const sinSeleccion = elegidas.length === 0;

  return (
    <aside className="panel">
      <h2 className="panel__titulo">Tu selección</h2>

      {sinSeleccion ? (
        <p className="panel__vacio">Elegí tus butacas en el mapa</p>
      ) : (
        <>
          <ul className="panel__butacas">
            {elegidas.map((butaca) => (
              <li key={butaca.id} className="panel__butaca">
                {butaca.nombre}
                <button
                  type="button"
                  className="panel__quitar"
                  onClick={() => quitar(butaca)}
                  aria-label={'Quitar butaca ' + butaca.nombre}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <hr className="panel__separador" />

          <p className="panel__renglon">
            <span>
              {elegidas.length} {elegidas.length === 1 ? 'butaca' : 'butacas'}
            </span>
            <span>${precio.toLocaleString('es-AR')} c/u</span>
          </p>
          <p className="panel__renglon panel__renglon--total">
            <span>Total entradas</span>
            <span className="panel__total">${total.toLocaleString('es-AR')}</span>
          </p>
        </>
      )}

      <button
        type="button"
        className="boton boton--primario panel__boton"
        onClick={irAlKiosco}
        disabled={sinSeleccion}
      >
        Continuar al kiosco
      </button>
      <button
        type="button"
        className="boton boton--secundario panel__boton panel__boton--chico"
        onClick={irAlCarrito}
        disabled={sinSeleccion}
      >
        Ir directo al carrito
      </button>
    </aside>
  );
};

export default PanelSeleccion;
