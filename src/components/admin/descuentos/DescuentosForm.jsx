import { useState } from 'react';
import BotonAccion from '../ui/BotonAccion';

// El modal desmonta el formulario al cerrarse, asi que alcanza con el estado inicial.
const DescuentosForm = ({ descuentoAEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    codigo: descuentoAEditar?.codigo ?? '',
    porcentaje: descuentoAEditar?.porcentaje ?? '',
    fechaVencimiento: descuentoAEditar?.fechaVencimiento ?? '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      codigo: formData.codigo,
      porcentaje: Number(formData.porcentaje),
      // Vacio = sin vencimiento.
      fechaVencimiento: formData.fechaVencimiento || null,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Código</label>
        <input
          className="admin-input"
          name="codigo"
          placeholder="Ej: VERANO20"
          value={formData.codigo}
          onChange={handleChange}
          // El codigo no se edita una vez creado.
          disabled={descuentoAEditar !== null}
          required
        />
      </div>

      <div className="kiosco-form-row">
        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Porcentaje (%)</label>
          <input
            className="admin-input"
            name="porcentaje"
            type="number"
            min="1"
            max="100"
            step="1"
            value={formData.porcentaje}
            onChange={handleChange}
            required
          />
        </div>

        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Vencimiento (opcional)</label>
          <input
            className="admin-input"
            name="fechaVencimiento"
            type="date"
            value={formData.fechaVencimiento}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar} type="button">
          Cancelar
        </BotonAccion>
        <BotonAccion variante="primario" type="submit">
          Guardar
        </BotonAccion>
      </div>
    </form>
  );
};

export default DescuentosForm;
