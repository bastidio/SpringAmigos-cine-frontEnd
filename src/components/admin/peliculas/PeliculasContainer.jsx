import { useState, useEffect } from 'react';
import PeliculasTable from './PeliculasTable';
import PeliculasForm from './PeliculasForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const PeliculasContainer = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [peliculaABorrar, setPeliculaABorrar] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);

  const fetchPeliculas = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/peliculas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error(`No se pudieron cargar las películas (${res.status})`);
    }
    const data = await res.json();
    return data;
  };

  const actualizarPeliculas = async () => {
    try {
      setPeliculas(await fetchPeliculas());
    } catch (error) {
      console.error('Error cargando películas:', error);
    }
  };

  useEffect(() => {
    fetchPeliculas()
      .then(setPeliculas)
      .catch((error) => console.error('Error cargando películas:', error));
  }, []);

  const abrirModal = (pelicula = null) => {
    setPeliculaEditando(pelicula);
    setErrorGuardar(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setPeliculaEditando(null);
    setErrorGuardar(null);
    setModalAbierto(false);
  };

  const manejarGuardar = async (formData) => {
    const metodo = peliculaEditando ? 'PUT' : 'POST';
    const url = peliculaEditando ? `/peliculas/${peliculaEditando.id}` : '/peliculas';
    const token = localStorage.getItem('token');

    setErrorGuardar(null);
    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const datos = await res.json().catch(() => null);
        const motivos = datos?.validationErrors ? Object.values(datos.validationErrors) : [];
        const mensaje = motivos.length > 0
          ? motivos.join(', ')
          : datos?.message || `No se pudo guardar la película (${res.status})`;
        setErrorGuardar(mensaje);
        return;
      }

      cerrarModal();
      actualizarPeliculas();
    } catch (error) {
      console.error('Error guardando película:', error);
      setErrorGuardar('No se pudo conectar con el servidor.');
    }
  };

  const manejarEliminar = (id) => {
    setPeliculaABorrar(id);
  };

  const cancelarEliminar = () => {
    setPeliculaABorrar(null);
  };

  const confirmarEliminar = async () => {
    setBorrando(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/peliculas/${peliculaABorrar}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const datos = await res.json().catch(() => null);
        throw new Error(datos?.message || `No se pudo borrar la película (${res.status})`);
      }

      actualizarPeliculas();
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
        {errorGuardar && (
          <p role="alert" className="pagina_mensaje pagina_mensaje--error">{errorGuardar}</p>
        )}
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

export default PeliculasContainer;
