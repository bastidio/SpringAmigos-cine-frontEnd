import { useState } from 'react';
import BotonAccion from '../ui/BotonAccion';
import { butacasFaltantes, butacasSobrantes } from './calculoButacas';

const MAX_FILAS = 26;
const MAX_POR_FILA = 40;

const SalaForm = ({ sala, asientosDeSala, guardando, progreso, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState(() => {
    if (sala === null) {
      return { nombre: '', filas: '8', porFila: '10' };
    }

    if (asientosDeSala.length > 0) {
      return {
        nombre: sala.nombre,
        filas: String(Math.max(...asientosDeSala.map((asiento) => asiento.fila))),
        porFila: String(Math.max(...asientosDeSala.map((asiento) => asiento.numero))),
      };
    }

    return {
      nombre: sala.nombre,
      filas: String(Math.min(MAX_FILAS, Math.max(1, Math.ceil(sala.capacidad / 10)))),
      porFila: '10',
    };
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filas = Number(formData.filas);
  const porFila = Number(formData.porFila);
  const valido =
    formData.nombre.trim() !== '' &&
    Number.isInteger(filas) && filas >= 1 && filas <= MAX_FILAS &&
    Number.isInteger(porFila) && porFila >= 1 && porFila <= MAX_POR_FILA;

  // La capacidad de la sala es la cantidad de butacas que va a tener el mapa.
  const capacidad = valido ? filas * porFila : 0;
  const nuevas = valido ? butacasFaltantes(asientosDeSala, filas, porFila) : [];
  const sobrantes = valido ? butacasSobrantes(asientosDeSala, filas, porFila) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valido) {
      onGuardar({ nombre: formData.nombre.trim(), capacidad, filas, porFila });
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="kiosco-form-group">
        <label className="kiosco-form-label" htmlFor="sala-nombre">Nombre de la sala</label>
        <input
          id="sala-nombre"
          className="admin-input"
          name="nombre"
          placeholder="Ej: Sala 1 - IMAX"
          value={formData.nombre}
          onChange={handleChange}
          disabled={guardando}
          required
        />
      </div>

      <div className="admin-form-row">
        <div className="kiosco-form-group">
          <label className="kiosco-form-label" htmlFor="sala-filas">Filas (máx. {MAX_FILAS})</label>
          <input
            id="sala-filas"
            className="admin-input"
            name="filas"
            type="number"
            min="1"
            max={MAX_FILAS}
            value={formData.filas}
            onChange={handleChange}
            disabled={guardando}
            required
          />
        </div>

        <div className="kiosco-form-group">
          <label className="kiosco-form-label" htmlFor="sala-por-fila">Butacas por fila (máx. {MAX_POR_FILA})</label>
          <input
            id="sala-por-fila"
            className="admin-input"
            name="porFila"
            type="number"
            min="1"
            max={MAX_POR_FILA}
            value={formData.porFila}
            onChange={handleChange}
            disabled={guardando}
            required
          />
        </div>
      </div>

      <div className="sala-form_resumen" aria-live="polite">
        {!valido && <span>Completá el nombre y una cantidad válida de filas y de butacas por fila.</span>}
        {valido && (
          <span>
            La sala quedará con <strong>{capacidad}</strong> butacas ({filas} {filas === 1 ? 'fila' : 'filas'} de {porFila}).
          </span>
        )}
        {valido && nuevas.length > 0 && (
          <span>
            Se crearán <strong>{nuevas.length}</strong> {nuevas.length === 1 ? 'butaca nueva' : 'butacas nuevas'}.
          </span>
        )}
        {valido && sobrantes.length > 0 && (
          <span className="sala-form_quitar">
            Se quitarán <strong>{sobrantes.length}</strong> {sobrantes.length === 1 ? 'butaca' : 'butacas'}.
          </span>
        )}
        {valido && sala !== null && asientosDeSala.length > 0 && sala.capacidad !== asientosDeSala.length && (
          <span className="sala-form_aviso">
            La capacidad guardada ({sala.capacidad}) estaba desactualizada: se corrige al guardar.
          </span>
        )}
      </div>

      {guardando && progreso !== null && progreso.total > 0 && (
        <p className="sala-form_progreso" role="status">
          Guardando butacas... {progreso.hechas} de {progreso.total}
        </p>
      )}

      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar}>
          Cancelar
        </BotonAccion>
        <button type="submit" className="btn-admin btn-primario" disabled={guardando || !valido}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default SalaForm;