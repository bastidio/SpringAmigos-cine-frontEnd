import { useState } from 'react';
import BotonAccion from '../ui/BotonAccion';
import { butacasFaltantes } from './butacasFaltantes';

const MAX_FILAS = 26;
const MAX_POR_FILA = 40;
const POR_FILA_SUGERIDO = 10;

const GenerarButacasForm = ({ sala, asientosDeSala, generando, progreso, onGenerar, onCancelar }) => {
  const [formData, setFormData] = useState(() => {
    if (asientosDeSala.length > 0) {
      const filasActuales = Math.max(...asientosDeSala.map((asiento) => asiento.fila));
      const porFilaActual = Math.max(...asientosDeSala.map((asiento) => asiento.numero));
      return {
        filas: String(Math.min(MAX_FILAS, Math.max(filasActuales, Math.ceil(sala.capacidad / porFilaActual)))),
        porFila: String(porFilaActual),
      };
    }
    return {
      filas: String(Math.min(MAX_FILAS, Math.max(1, Math.ceil(sala.capacidad / POR_FILA_SUGERIDO)))),
      porFila: String(POR_FILA_SUGERIDO),
    };
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filas = Number(formData.filas);
  const porFila = Number(formData.porFila);
  const valido =
    Number.isInteger(filas) && filas >= 1 && filas <= MAX_FILAS &&
    Number.isInteger(porFila) && porFila >= 1 && porFila <= MAX_POR_FILA;

  const nuevas = valido ? butacasFaltantes(asientosDeSala, filas, porFila) : [];
  const totalFinal = asientosDeSala.length + nuevas.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valido && nuevas.length > 0) onGenerar({ filas, porFila });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <p className="generar-butacas_texto">
        Define cuántas filas y cuántas butacas por fila tiene <strong>{sala.nombre}</strong>. Solo se crean
        las butacas que faltan; las que ya existen no se modifican.
      </p>

      <div className="admin-form-row">
        <div className="kiosco-form-group">
          <label className="kiosco-form-label" htmlFor="generar-filas">Filas (máx. {MAX_FILAS})</label>
          <input
            id="generar-filas"
            className="admin-input"
            name="filas"
            type="number"
            min="1"
            max={MAX_FILAS}
            value={formData.filas}
            onChange={handleChange}
            disabled={generando}
            required
          />
        </div>

        <div className="kiosco-form-group">
          <label className="kiosco-form-label" htmlFor="generar-por-fila">Butacas por fila (máx. {MAX_POR_FILA})</label>
          <input
            id="generar-por-fila"
            className="admin-input"
            name="porFila"
            type="number"
            min="1"
            max={MAX_POR_FILA}
            value={formData.porFila}
            onChange={handleChange}
            disabled={generando}
            required
          />
        </div>
      </div>

      <div className="generar-butacas_resumen" aria-live="polite">
        {!valido && <span>Ingresá una cantidad válida de filas y de butacas por fila.</span>}
        {valido && nuevas.length === 0 && <span>La sala ya tiene todas esas butacas: no hay nada para crear.</span>}
        {valido && nuevas.length > 0 && (
          <span>
            Se crearán <strong>{nuevas.length}</strong> {nuevas.length === 1 ? 'butaca nueva' : 'butacas nuevas'}
            {' '}(quedan <strong>{totalFinal}</strong> en total).
          </span>
        )}
        {valido && totalFinal !== sala.capacidad && (
          <span className="generar-butacas_aviso">
            La capacidad configurada de la sala es {sala.capacidad}.
          </span>
        )}
      </div>

      {generando && progreso !== null && (
        <p className="generar-butacas_progreso" role="status">
          Creando butacas... {progreso.hechas} de {progreso.total}
        </p>
      )}

      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar}>
          Cancelar
        </BotonAccion>
        <button
          type="submit"
          className="btn-admin btn-primario"
          disabled={generando || !valido || nuevas.length === 0}
        >
          {generando ? 'Generando...' : 'Generar'}
        </button>
      </div>
    </form>
  );
};

export default GenerarButacasForm;
