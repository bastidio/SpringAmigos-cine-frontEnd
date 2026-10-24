import { useState, useEffect } from 'react';
import BotonAccion from '../ui/BotonAccion';

const FuncionesForm = ({ funcionAEditar, peliculas, salas, onGuardar, onCancelar }) => {
  // Separamos horario en fecha y hora en el estado inicial
  const [formData, setFormData] = useState({
    pelicula_id: '', sala_id: '', fecha: '', hora: '', idioma: '', formato: '', precio_base: ''
  });

  useEffect(() => {
    if (funcionAEditar) {
      let fechaBd = '';
      let horaBd = '';

      if (funcionAEditar.horario) {
        // Reemplazamos espacio por "T" por si viene de la tabla, y separamos
        const horarioNormalizado = funcionAEditar.horario.replace(' ', 'T');
        const partes = horarioNormalizado.split('T');
        fechaBd = partes[0] || '';
        // Nos quedamos solo con HH:mm (ej: 19:30)
        horaBd = partes[1] ? partes[1].substring(0, 5) : ''; 
      }

      setFormData({
        ...funcionAEditar,
        pelicula_id: String(funcionAEditar.pelicula_id ?? funcionAEditar.pelicula?.id ?? ''),
        sala_id: String(funcionAEditar.sala_id ?? funcionAEditar.sala?.id ?? ''),
        fecha: fechaBd,
        hora: horaBd,
      });
    }
  }, [funcionAEditar]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extraemos fecha y hora para unirlos, y el resto de los datos para enviarlos
    const { fecha, hora, ...datosParaGuardar } = formData;
    const horarioCombinado = `${fecha}T${hora}:00`;

    onGuardar({
      ...datosParaGuardar,
      horario: horarioCombinado
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      
      <select className="admin-input" name="pelicula_id" value={formData.pelicula_id} onChange={handleChange} required>
        <option value="">Seleccionar Película...</option>
        {peliculas.map(p => (
          <option key={p.id} value={String(p.id)}>{p.titulo}</option>
        ))}
      </select>

      <select className="admin-input" name="sala_id" value={formData.sala_id} onChange={handleChange} required>
        <option value="">Seleccionar Sala...</option>
        {salas.map(s => (
          <option key={s.id} value={String(s.id)}>{s.nombre}</option>
        ))}
      </select>
      
      {/* Fila dividida para Fecha y Hora usando tu clase admin-form-row */}
      <div className="admin-form-row">
        <input className="admin-input" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
        <input className="admin-input" name="hora" type="time" value={formData.hora} onChange={handleChange} required />
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