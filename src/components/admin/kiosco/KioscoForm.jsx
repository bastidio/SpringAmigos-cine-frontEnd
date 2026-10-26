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
    posterProducto: '',
    activo: true 
  });

  useEffect(() => {
    if (productoAEditar) {
      setFormData({
        ...productoAEditar,
        categoria_id: productoAEditar.categoria?.id || '',
        
        posterProducto: productoAEditar.posterProducto || ''
      });
    }
  }, [productoAEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onGuardar({ ...formData, posterProducto: formData.posterProducto.trim() || null });
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
        <label className="kiosco-form-label">URL de imagen (opcional)</label>
        {}
        <input
          className="admin-input"
          name="posterProducto"
          type="url"
          placeholder="https://..."
          pattern="https?://.+"
          title="La URL tiene que empezar con http:// o https://"
          value={formData.posterProducto}
          onChange={handleChange}
        />
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