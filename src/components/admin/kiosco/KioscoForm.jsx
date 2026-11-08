import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';

const KioscoForm = ({ productoAEditar, categorias, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '', 
    descripcion: '', 
    categoria_id: '', 
    precio: '', 
    stock: '', 
    descuento: 0,
    imagenes: [''],
    activo: true
  });

  useEffect(() => {
    if (productoAEditar) {
      setFormData({
        ...productoAEditar,
        categoria_id: productoAEditar.categoria?.id || '',
        imagenes: productoAEditar.imagenes?.length > 0
          ? productoAEditar.imagenes.map((img) => img.url)
          : ['']
      });
    }
  }, [productoAEditar]);

  // La primera URL es la imagen principal. Siempre queda al menos un campo.
  const cambiarImagen = (indice, valor) => {
    setFormData({
      ...formData,
      imagenes: formData.imagenes.map((url, i) => (i === indice ? valor : url))
    });
  };

  const agregarImagen = () => {
    setFormData({ ...formData, imagenes: [...formData.imagenes, ''] });
  };

  const quitarImagen = (indice) => {
    setFormData({
      ...formData,
      imagenes: formData.imagenes.filter((_, i) => i !== indice)
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onGuardar({
      ...formData,
      imagenes: formData.imagenes.map((url) => url.trim()).filter(Boolean)
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Nombre del producto</label>
        <input 
          className="admin-input" 
          name="nombre" 
          placeholder="Ej: Pochoclos Grandes" 
          value={formData.nombre} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Descripción</label>
        <textarea 
          className="admin-input" 
          name="descripcion" 
          placeholder="Detalle corto del producto..." 
          value={formData.descripcion} 
          onChange={handleChange} 
          rows="2"
        />
      </div>

      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Imágenes (la primera es la principal)</label>
        {formData.imagenes.map((url, indice) => (
          <div key={indice} className="kiosco-form-imagen">
            <input
              className="admin-input"
              type="url"
              placeholder="https://..."
              pattern="https?://.+"
              title="La URL tiene que empezar con http:// o https://"
              value={url}
              onChange={(e) => cambiarImagen(indice, e.target.value)}
              required={indice === 0}
            />
            {formData.imagenes.length > 1 && (
              <BotonAccion variante="secundario" type="button" onClick={() => quitarImagen(indice)}>
                Quitar
              </BotonAccion>
            )}
          </div>
        ))}
        <BotonAccion variante="secundario" type="button" onClick={agregarImagen}>
          Agregar otra imagen
        </BotonAccion>
      </div>

      <div className="kiosco-form-group">
        <label className="kiosco-form-label">Categoría</label>
        <select 
          className="admin-input" 
          name="categoria_id" 
          value={formData.categoria_id} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccionar Categoría...</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>
      
      {}
      <div className="kiosco-form-row">
        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Precio ($)</label>
          <input 
            className="admin-input" 
            name="precio" 
            type="number" 
            step="0.01" 
            value={formData.precio} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Stock</label>
          <input 
            className="admin-input" 
            name="stock" 
            type="number" 
            value={formData.stock} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="kiosco-form-group" style={{ marginBottom: 0 }}>
          <label className="kiosco-form-label">Descuento (%)</label>
          <input 
            className="admin-input" 
            name="descuento" 
            type="number" 
            step="0.01" 
            value={formData.descuento} 
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

export default KioscoForm;