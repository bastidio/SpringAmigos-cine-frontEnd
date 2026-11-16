import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunciones, fetchTodasPeliculas, createFuncion, updateFuncion, deleteFuncion } from '../../../redux/carteleraSlice';
import { fetchSalas } from '../../../redux/salasSlice';
import FuncionesTable from './FuncionesTable';
import FuncionesForm from './FuncionForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const FuncionesContainer = () => {
  const dispatch = useDispatch();
  const { funciones, peliculas } = useSelector((state) => state.cartelera);
  const { items: salas } = useSelector((state) => state.salas);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  const [funcionAEliminar, setFuncionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorOperacion, setErrorOperacion] = useState(null);

  const fechaHoy = new Date();
  const fechaManana = new Date();
  fechaManana.setDate(fechaHoy.getDate() + 1);

  const formatearValue = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  };

  const formatearLabel = (date) => {
    const texto = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const hoyValue = formatearValue(fechaHoy);
  const mananaValue = formatearValue(fechaManana);
  const [diaSeleccionado, setDiaSeleccionado] = useState('todas');

  useEffect(() => {
    dispatch(fetchFunciones());
    dispatch(fetchTodasPeliculas());
    dispatch(fetchSalas());
  }, [dispatch]);

  const abrirModal = (funcion = null) => {
    setFuncionEditando(funcion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setFuncionEditando(null);
    setModalAbierto(false);
  };

  // La lista se actualiza en el fulfilled del thunk: no se vuelve a pedir.
  const manejarGuardar = async (formData) => {
    const res = await dispatch( funcionEditando !== null ? updateFuncion({ ...formData, id: funcionEditando.id }) : createFuncion(formData));
    if (res.error) {
      console.error('Error al guardar:', res.error.message);
      return;
    }
    cerrarModal();
  };

  const funcionesFiltradas = diaSeleccionado === 'todas'
    ? funciones
    : funciones.filter(f => f.horario && f.horario.startsWith(diaSeleccionado));

  const manejarEliminar = (id) => {
    setErrorOperacion(null);
    setFuncionAEliminar(id);
  };

  const confirmarEliminar = async () => {
    if (!funcionAEliminar) return;
    setEliminando(true);
    setErrorOperacion(null);

    const res = await dispatch(deleteFuncion(funcionAEliminar));
    setEliminando(false);
    if (res.error) {
      setErrorOperacion(`No se pudo eliminar la función: ${res.error.message}`);
      return;
    }
    setFuncionAEliminar(null);
  };

  return (
    <div>
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Gestión de Funciones</h1>
          <p className="admin-view-count">
            {funcionesFiltradas.length} funciones para {diaSeleccionado === 'todas' ? 'todos los días' : 'el día seleccionado'}
          </p>
        </div>
        <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nueva Función</BotonAccion>
      </div>

      <div className="filtros-fecha-container">
        <button
          className={`btn-filtro-dia ${diaSeleccionado === 'todas' ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado('todas')}
        >
          Todas
        </button>

        <button
          className={`btn-filtro-dia ${diaSeleccionado === hoyValue ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado(hoyValue)}
        >
          Hoy — {formatearLabel(fechaHoy)}
        </button>

        <button
          className={`btn-filtro-dia ${diaSeleccionado === mananaValue ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado(mananaValue)}
        >
          Mañana — {formatearLabel(fechaManana)}
        </button>

        <input
          type="date"
          value={diaSeleccionado !== 'todas' ? diaSeleccionado : ''}
          onChange={(e) => setDiaSeleccionado(e.target.value || 'todas')}
          className="btn-filtro-dia input-fecha"
        />
      </div>

      <FuncionesTable funciones={funcionesFiltradas} onEditar={abrirModal} onEliminar={manejarEliminar} />

      <VentanaEmergente
        abierta={funcionAEliminar !== null}
        titulo={errorOperacion ? 'Acción denegada' : 'Eliminar Función'}
        mensaje={errorOperacion ? errorOperacion : `¿Estás seguro de que querés borrar la función #${funcionAEliminar}? Esta acción no se puede deshacer.`}
        variante={errorOperacion ? 'aviso' : 'peligro'}
        textoConfirmar={errorOperacion ? 'Entendido' : 'Sí, borrar'}
        ocupado={eliminando}
        onConfirmar={errorOperacion ? () => { setFuncionAEliminar(null); setErrorOperacion(null); } : confirmarEliminar}
        onCancelar={errorOperacion ? undefined : () => { setFuncionAEliminar(null); setErrorOperacion(null); }}
      />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={funcionEditando ? 'Editar Función' : 'Nueva Función'}>
        <FuncionesForm
          funcionAEditar={funcionEditando}
          peliculas={peliculas}
          salas={salas}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </AdminModal>
    </div>
  );
};

export default FuncionesContainer;
