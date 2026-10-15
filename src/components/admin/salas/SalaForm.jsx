import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';

const SalaForm = ({ salaAEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad: ''
  });

  // Si pasamos una sala para editar, cargamos sus datos en el formulario
  useEffect(() => {
    if (salaAEditar) {
      setFormData(salaAEditar);
    }
  }, [salaAEditar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <input 
        className="admin-input" 
        name="nombre" 
        placeholder="Nombre de la Sala (Ej: Sala 1 - IMAX)" 
        value={formData.nombre} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        className="admin-input" 
        name="capacidad" 
        type="number" 
        min="1"
        placeholder="Capacidad total de butacas" 
        value={formData.capacidad} 
        onChange={handleChange} 
        required 
      />

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

export default SalaForm;