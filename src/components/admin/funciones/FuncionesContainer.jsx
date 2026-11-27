import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunciones, fetchTodasPeliculas, createFuncion, updateFuncion, deleteFuncion } from '../../../redux/carteleraSlice';
import { fetchSalas } from '../../../redux/salasSlice';
import FuncionesTable from './FuncionesTable';
import FuncionesForm from './FuncionForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';
import { SIN_CONEXION } from '../../../redux/mensajeDeError';

const FuncionesContainer = () => {
  const dispatch = useDispatch();
  const {
    funciones, funcionesEstado, errorFunciones, todasPeliculas: peliculas, todasPeliculasEstado, error,
  } = useSelector((state) => state.cartelera);
  const { items: salas, salasEstado, error: errorSalas } = useSelector((state) => state.salas);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  const [funcionAEliminar, setFuncionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorOperacion, setErrorOperacion] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);

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
    if (funcionesEstado === 'inicial' && errorFunciones === null) dispatch(fetchFunciones());
  }, [dispatch, funcionesEstado, errorFunciones]);

  useEffect(() => {
    if (todasPeliculasEstado === 'inicial' && error === null) dispatch(fetchTodasPeliculas());
  }, [dispatch, todasPeliculasEstado, error]);

  useEffect(() => {
    if (salasEstado === 'inicial' && errorSalas === null) dispatch(fetchSalas());
  }, [dispatch, salasEstado, errorSalas]);

  const abrirModal = (funcion = null) => {
    setFuncionEditando(funcion);
    setErrorGuardar(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setFuncionEditando(null);
    setErrorGuardar(null);
    setModalAbierto(false);
  };

  // La lista se actualiza en el fulfilled del thunk: no se vuelve a pedir.
  const manejarGuardar = async (formData) => {
    setErrorGuardar(null);
    const res = await dispatch( funcionEditando !== null ? updateFuncion({ ...formData, id: funcionEditando.id }) : createFuncion(formData));
    if (res.error) {
      setErrorGuardar(SIN_CONEXION);
      if (res.payload) setErrorGuardar(res.payload);
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
      setErrorOperacion(SIN_CONEXION);
      if (res.payload) setErrorOperacion(res.payload);
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
        {errorGuardar && (
          <p role="alert" className="pagina_mensaje pagina_mensaje--error">{errorGuardar}</p>
        )}
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
