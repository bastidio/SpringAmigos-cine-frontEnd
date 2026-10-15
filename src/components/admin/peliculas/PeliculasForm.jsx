import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';


const PeliculasForm = ({ peliculaAEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '', sinopsis: '', duracion: '', clasificacion: '', idioma: '', poster_url: ''
  });

  useEffect(() => {
    if (peliculaAEditar) setFormData(peliculaAEditar);
  }, [peliculaAEditar]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <input className="admin-input" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" required />
      
      <div className="admin-form-row">
        <input className="admin-input" name="duracion" type="number" value={formData.duracion} onChange={handleChange} placeholder="Duración (min)" />
        <input className="admin-input" name="clasificacion" value={formData.clasificacion} onChange={handleChange} placeholder="Clasificación (Ej: +13)" />
      </div>
      
      <input className="admin-input" name="idioma" value={formData.idioma} onChange={handleChange} placeholder="Idioma (Ej: Subtitulada)" />
      <input className="admin-input" name="poster_url" value={formData.poster_url} onChange={handleChange} placeholder="URL del Póster" />
      <textarea className="admin-input admin-textarea" name="sinopsis" value={formData.sinopsis} onChange={handleChange} placeholder="Sinopsis" rows="4" />
      
      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar} type="button">Cancelar</BotonAccion>
        <BotonAccion variante="primario" type="submit">Guardar</BotonAccion>
      </div>
    </form>
  );
};

export default PeliculasForm;