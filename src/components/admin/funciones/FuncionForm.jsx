import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';

// Agregamos peliculas y salas a las props
const FuncionesForm = ({ funcionAEditar, peliculas, salas, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    pelicula_id: '', sala_id: '', horario: '', idioma: '', formato: '', precio_base: ''
  });

  useEffect(() => {
    if (funcionAEditar) {
      setFormData({
        ...funcionAEditar,
        pelicula_id: String(funcionAEditar.pelicula_id ?? funcionAEditar.pelicula?.id ?? ''),
        sala_id: String(funcionAEditar.sala_id ?? funcionAEditar.sala?.id ?? ''),
      });
    }
  }, [funcionAEditar]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      
      {/* Select Dinámico de Películas */}
      <select className="admin-input" name="pelicula_id" value={formData.pelicula_id} onChange={handleChange} required>
        <option value="">Seleccionar Película...</option>
        {peliculas.map(p => (
          <option key={p.id} value={String(p.id)}>{p.titulo}</option>
        ))}
      </select>

      {/* Select Dinámico de Salas */}
      <select className="admin-input" name="sala_id" value={formData.sala_id} onChange={handleChange} required>
        <option value="">Seleccionar Sala...</option>
        {salas.map(s => (
          <option key={s.id} value={String(s.id)}>{s.nombre}</option>
        ))}
      </select>
      
      <input className="admin-input" name="horario" type="datetime-local" value={formData.horario} onChange={handleChange} required />
      
      <div className="admin-form-row">
        <input className="admin-input" name="idioma" value={formData.idioma} onChange={handleChange} placeholder="Idioma (Ej: Subtitulada)" required />
        <input className="admin-input" name="formato" value={formData.formato} onChange={handleChange} placeholder="Formato (Ej: 2D, 3D)" required />
      </div>

      <input className="admin-input" name="precio_base" type="number" step="0.01" value={formData.precio_base} onChange={handleChange} placeholder="Precio Base ($)" required />
      
      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar} type="button">Cancelar</BotonAccion>
        <BotonAccion variante="primario" type="submit">Guardar</BotonAccion>
      </div>
    </form>
  );
};

export default FuncionesForm;