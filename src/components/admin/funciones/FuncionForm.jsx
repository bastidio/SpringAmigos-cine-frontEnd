import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';

const FuncionesForm = ({ funcionAEditar, peliculas, salas, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    pelicula_id: '', sala_id: '', idioma: '', formato: '', precio_base: ''
  });
  
  // Estados separados para fecha y hora
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    if (funcionAEditar) {
      setFormData({
        ...funcionAEditar,
        pelicula_id: String(funcionAEditar.pelicula_id ?? funcionAEditar.pelicula?.id ?? ''),
        sala_id: String(funcionAEditar.sala_id ?? funcionAEditar.sala?.id ?? ''),
      });

      // Separamos el string "YYYY-MM-DDTHH:mm:00" que viene del backend
      if (funcionAEditar.horario) {
        const [fechaPart, horaPart] = funcionAEditar.horario.split('T');
        setFecha(fechaPart);
        setHora(horaPart ? horaPart.substring(0, 5) : ''); 
      }
    } else {
      // Limpiamos todo si es nueva función
      setFormData({ pelicula_id: '', sala_id: '', idioma: '', formato: '', precio_base: '' });
      setFecha('');
      setHora('');
    }
  }, [funcionAEditar]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Unimos fecha y hora
    const horarioFormateado = `${fecha}T${hora}:00`;

    // Armamos el objeto respetando EXACTAMENTE tu DTO FuncionRequest
    const datosParaBackend = {
      peliculaId: parseInt(formData.pelicula_id), // camelCase como en Java
      salaId: parseInt(formData.sala_id),         // camelCase como en Java
      horario: horarioFormateado,
      idioma: formData.idioma,
      formato: formData.formato,
      precio_base: parseFloat(formData.precio_base) // snake_case como en Java
    };

    onGuardar(datosParaBackend);
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
      
      {/* Inputs separados aprovechando tu clase admin-form-row */}
      <div className="admin-form-row">
        <input 
          className="admin-input" 
          type="date" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)} 
          required 
        />
        <input 
          className="admin-input" 
          type="time" 
          value={hora} 
          onChange={(e) => setHora(e.target.value)} 
          required 
        />
      </div>
      
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