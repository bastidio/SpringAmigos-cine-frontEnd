import { useState, useEffect } from 'react';
import PeliculasTable from '../../components/admin/peliculas/PeliculasTable';
import PeliculasForm from '../../components/admin/peliculas/PeliculasForm';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';
import VentanaEmergente from '../../components/ui/VentanaEmergente';

const AdminPeliculasView = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  // Ventana emergente para borrar: id de la pelicula a confirmar (null = cerrada),
  // si se esta borrando y el error si el back no la borro.
  const [peliculaABorrar, setPeliculaABorrar] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

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

  // Antes era un window.confirm: ahora se guarda el id y se abre la
  // VentanaEmergente para confirmar.
  const manejarEliminar = (id) => {
    setPeliculaABorrar(id);
  };

  const cancelarEliminar = () => {
    setPeliculaABorrar(null);
  };

  const confirmarEliminar = async () => {
    setBorrando(true);
    try {
      const token = localStorage.getItem('token'); // 1. Recuperamos el token

      const res = await fetch(`/peliculas/${peliculaABorrar}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`       // 2. Lo enviamos en el header
        }
      });

      // Si el back no la borra (por ejemplo, 409 porque tiene funciones), se
      // muestra su mensaje en otra ventana emergente.
      if (!res.ok) {
        const datos = await res.json().catch(() => null);
        throw new Error(datos?.message || `No se pudo borrar la película (${res.status})`);
      }

      fetchPeliculas();
    } catch (error) {
      setErrorEliminar(error.message);
    } finally {
      setBorrando(false);
      setPeliculaABorrar(null);
    }
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

      <VentanaEmergente
        abierta={peliculaABorrar !== null}
        variante="peligro"
        titulo="Borrar película"
        mensaje={`¿Seguro que querés borrar "${peliculas.find((p) => p.id === peliculaABorrar)?.titulo ?? ''}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Borrar"
        ocupado={borrando}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />

      <VentanaEmergente
        abierta={errorEliminar !== null}
        titulo="No se pudo borrar"
        mensaje={errorEliminar}
        onConfirmar={() => setErrorEliminar(null)}
      />
    </div>
  );
};

export default AdminPeliculasView;