import { useState, useEffect } from 'react';
import PeliculasTable from '../../components/admin/peliculas/PeliculasTable';
import PeliculasForm from '../../components/admin/peliculas/PeliculasForm';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminPeliculasView = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const fetchPeliculas = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/peliculas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setPeliculas(data);
  };

  useEffect(() => { fetchPeliculas(); }, []);

  const abrirModal = (pelicula = null) => {
    setPeliculaEditando(pelicula);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setPeliculaEditando(null);
    setModalAbierto(false);
  };

  const manejarGuardar = async (formData) => {
    const metodo = peliculaEditando ? 'PUT' : 'POST';
    const url = peliculaEditando ? `/peliculas/${peliculaEditando.id}` : '/peliculas';
    const token = localStorage.getItem('token'); // 1. Recuperamos el token

    await fetch(url, {
      method: metodo,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`       // 2. Lo enviamos en el header
      },
      body: JSON.stringify(formData)
    });

    cerrarModal();
    fetchPeliculas(); 
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar esta película?')) return;
    
    const token = localStorage.getItem('token'); // 1. Recuperamos el token

    await fetch(`/peliculas/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`       // 2. Lo enviamos en el header
      }
    });
    
    fetchPeliculas();
  };

  const peliculasFiltradas = peliculas.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Gestión de Películas</h1>
          <p className="admin-view-count">
            {peliculas.length} {peliculas.length === 1 ? 'película' : 'películas'} en catálogo
          </p>
        </div>
        
        <div className="admin-header-actions">
          <input 
            className="admin-search"
            type="text" 
            placeholder="Buscar película..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nueva Película</BotonAccion>
        </div>
      </div>

      <PeliculasTable 
        peliculas={peliculasFiltradas} 
        onEditar={abrirModal} 
        onEliminar={manejarEliminar} 
      />

      <AdminModal 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        titulo={peliculaEditando ? 'Editar Película' : 'Nueva Película'}
      >
        <PeliculasForm 
          peliculaAEditar={peliculaEditando} 
          onGuardar={manejarGuardar} 
          onCancelar={cerrarModal} 
        />
      </AdminModal>
    </div>
  );
};

export default AdminPeliculasView;