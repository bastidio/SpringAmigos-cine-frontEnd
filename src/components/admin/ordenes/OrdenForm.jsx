import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';


const OrdenForm = ({ ordenAEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    estado: 'PENDIENTE'
  });

  useEffect(() => {
    if (ordenAEditar) setFormData({ estado: ordenAEditar.estado });
  }, [ordenAEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="orden-form-group">
        <label className="orden-form-label">Estado de la Orden</label>
        <select 
          className="admin-input" 
          name="estado" 
          value={formData.estado} 
          onChange={(e) => setFormData({ estado: e.target.value })} 
          required
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>
      
      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar} type="button">Cancelar</BotonAccion>
        <BotonAccion variante="primario" type="submit">Guardar</BotonAccion>
      </div>
    </form>
  );
};

export default OrdenForm;