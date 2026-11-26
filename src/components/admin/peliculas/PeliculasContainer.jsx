import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodasPeliculas, createPelicula, updatePelicula, deletePelicula } from '../../../redux/carteleraSlice';
import PeliculasTable from './PeliculasTable';
import PeliculasForm from './PeliculasForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const PeliculasContainer = () => {
  const dispatch = useDispatch();
  const { todasPeliculas: peliculas, todasPeliculasEstado, error } = useSelector((state) => state.cartelera);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [peliculaABorrar, setPeliculaABorrar] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);

  useEffect(() => {
    if (todasPeliculasEstado === 'inicial' && error === null) dispatch(fetchTodasPeliculas());
  }, [dispatch, todasPeliculasEstado, error]);

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
    setErrorGuardar(null);
    const res = await dispatch(peliculaEditando !== null ? updatePelicula({ ...formData, id: peliculaEditando.id }) : createPelicula(formData));
    if (res.error) {
      setErrorGuardar(`No se pudo guardar la película: ${res.error.message}`);
      return;
    }
    cerrarModal();
  };

  const manejarEliminar = (id) => {
    setPeliculaABorrar(id);
  };

  const cancelarEliminar = () => {
    setPeliculaABorrar(null);
  };

  const confirmarEliminar = async () => {
    setBorrando(true);
    const res = await dispatch(deletePelicula(peliculaABorrar));
    setBorrando(false);
    setPeliculaABorrar(null);
    if (res.error) setErrorEliminar(`No se pudo borrar la película: ${res.error.message}`);
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
