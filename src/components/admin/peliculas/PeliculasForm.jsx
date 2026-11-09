import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';


const PeliculasForm = ({ peliculaAEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '', sinopsis: '', duracion: '', clasificacion: '', idioma: '', poster_url: '', bannerUrl: ''
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
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Título</label>
        <input className="admin-input" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Dune: Parte Dos" required />
      </div>

      <div className="kiosco-form-row">
        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Duración (min)</label>
          <input className="admin-input" name="duracion" type="number" value={formData.duracion} onChange={handleChange} placeholder="Ej: 120" />
        </div>

        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Clasificación</label>
          <input className="admin-input" name="clasificacion" value={formData.clasificacion} onChange={handleChange} placeholder="Ej: +13" />
        </div>
      </div>

      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Idioma</label>
        <input className="admin-input" name="idioma" value={formData.idioma} onChange={handleChange} placeholder="Ej: Subtitulada" />
      </div>
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">URL del póster</label>
        <input className="admin-input" name="poster_url" value={formData.poster_url} onChange={handleChange} placeholder="https://..." />
      </div>
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Imagen del banner (horizontal)</label>
        <input className="admin-input" name="bannerUrl" value={formData.bannerUrl ?? ''} onChange={handleChange} placeholder="https://..." />
        {formData.bannerUrl && (
          <img src={formData.bannerUrl} alt="Vista previa del banner" className="img-miniatura-tabla img-banner" />
        )}
      </div>
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Sinopsis</label>
        <textarea className="admin-input admin-textarea" name="sinopsis" value={formData.sinopsis} onChange={handleChange} placeholder="Resumen corto de la película..." rows="4" />
      </div>

      <div className="admin-form-actions">
        <BotonAccion variante="secundario" onClick={onCancelar} type="button">Cancelar</BotonAccion>
        <BotonAccion variante="primario" type="submit">Guardar</BotonAccion>
      </div>
    </form>
  );
};

export default PeliculasForm;