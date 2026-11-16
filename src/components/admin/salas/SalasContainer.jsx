
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalas, createSala, updateSala, fetchAsientos, createAsiento, deleteAsiento } from '../../../redux/salasSlice';
import { fetchFunciones } from '../../../redux/carteleraSlice';
import SalasList from './SalasList';
import SalaForm from './SalaForm';
import { butacasFaltantes, butacasSobrantes, butacasTotales, agruparPorFila } from './calculoButacas';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';
import MapaSala from './MapaSala';

const AdminSalasView = () => {
  const dispatch = useDispatch();
  const { items: salas, asientos, loading, error } = useSelector((state) => state.salas);
  const { funciones } = useSelector((state) => state.cartelera);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [salaAEditar, setSalaAEditar] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  // fetchFunciones no guarda el error en el store, y sin saber si la sala tiene funciones
  // no se la puede dejar editar: por eso este estado queda local.
  const [estadoFunciones, setEstadoFunciones] = useState('cargando');
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState(null);

  let estadoAsientos = 'listo';
  if (loading) estadoAsientos = 'cargando';
  else if (error !== null) estadoAsientos = 'error';

  useEffect(() => {
    const cargarDatos = async () => {
      const res = await dispatch(fetchSalas());
      if (!res.error) setSalaSeleccionada(res.payload[0] ?? null);
      dispatch(fetchAsientos());
      const resFunciones = await dispatch(fetchFunciones());
      setEstadoFunciones(resFunciones.error ? 'error' : 'listo');
    };
    cargarDatos();
  }, [dispatch]);

  const abrirModal = (sala = null) => {
    setSalaAEditar(sala);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setSalaAEditar(null);
    setModalAbierto(false);
  };

  const guardarSala = async ({ nombre, capacidad, filas, porFila }) => {
    const editando = salaAEditar !== null;
    const actuales = editando
      ? asientos.filter((asiento) => asiento.sala?.id === salaAEditar.id)
      : [];
    const nuevas = butacasFaltantes(actuales, filas, porFila);
    const sobrantes = butacasSobrantes(actuales, filas, porFila);
    const total = nuevas.length + sobrantes.length;
    let hechas = 0;
    let errorButacas = null;

    setGuardando(true);
    setProgreso({ hechas, total });

    const res = await dispatch(editando ? updateSala({ id: salaAEditar.id, nombre, capacidad }) : createSala({ nombre, capacidad }));
    if (res.error) {
      setGuardando(false);
      setProgreso(null);
      setErrorGuardar('El servidor rechazó guardar la sala. Puede que tu sesión haya vencido o que la sala tenga funciones asignadas.');
      return;
    }
    const salaId = res.payload.id;
    setSalaSeleccionada(res.payload);

    for (const deLaFila of agruparPorFila(nuevas)) {
      const resultados = await Promise.all(deLaFila.map((butaca) => dispatch(createAsiento({ salaId, fila: butaca.fila, numero: butaca.numero }))));
      hechas += resultados.filter((r) => !r.error).length;
      setProgreso({ hechas, total });
      if (resultados.some((r) => r.error)) {
        errorButacas = 'El servidor rechazó una butaca.';
        break;
      }
    }

    if (errorButacas === null) {
      for (const deLaFila of agruparPorFila(sobrantes)) {
        const resultados = await Promise.all(deLaFila.map((butaca) => dispatch(deleteAsiento(butaca.id))));
        hechas += resultados.filter((r) => !r.error).length;
        setProgreso({ hechas, total });
        if (resultados.some((r) => r.error)) {
          errorButacas = 'El servidor rechazó quitar una butaca.';
          break;
        }
      }
    }

    setGuardando(false);
    setProgreso(null);
    cerrarModal();
    if (errorButacas !== null) {
      setErrorGuardar(`${errorButacas} La sala se guardó y se procesaron ${hechas} de ${total} butacas; al volver a guardar se completa lo que falte.`);
    }
  };

  const asientosDeLaSala = salaSeleccionada
    ? asientos.filter((asiento) => asiento.sala?.id === salaSeleccionada.id)
    : [];
  
  const totalesSala = salaSeleccionada
    ? butacasTotales(salaSeleccionada, asientos, estadoAsientos)
    : null;

  
  const funcionesDeLaSala = salaSeleccionada
    ? funciones.filter((funcion) => funcion.sala?.id === salaSeleccionada.id).length
    : 0;
  const puedeEditar =
    estadoFunciones === 'listo' && estadoAsientos === 'listo' && funcionesDeLaSala === 0;

  let avisoEdicion = null;
  if (estadoFunciones === 'error') {
    avisoEdicion = 'No se pudo comprobar si la sala tiene funciones, por eso no se puede editar.';
  } else if (funcionesDeLaSala > 0) {
    avisoEdicion =
      `Esta sala tiene ${funcionesDeLaSala} ${funcionesDeLaSala === 1 ? 'función asignada' : 'funciones asignadas'}: ` +
      'su configuración no se puede modificar. Para editarla, primero eliminá sus funciones.';
  }

  return (
    <div className="admin-salas-contenedor">

      {}
      <aside className="salas-sidebar">
        <div className="salas-header">
          <h2 className="admin-view-title">Gestión de Salas</h2>
          <p className="salas-subtitulo">{salas.length} salas configuradas</p>
        </div>

        <SalasList
          salas={salas}
          salaActiva={salaSeleccionada}
          onSeleccionar={setSalaSeleccionada}
          asientos={asientos}
          estadoAsientos={estadoAsientos}
        />
      </aside>

      <main className="salas-detalle">
        <div className="detalle-header">
          <button type="button" className="btn-nueva-sala" onClick={() => abrirModal()}>
            + Nueva sala
          </button>
        </div>

        {salaSeleccionada && (
          <div className="panel-mapa">
            <div className="panel-mapa-header">
              <div>
                <h2 className="panel-mapa-titulo">{salaSeleccionada.nombre}</h2>
                {totalesSala !== null && <p className="panel-mapa-subtitulo">{totalesSala} butacas totales</p>}
              </div>
              <button
                type="button"
                className="btn-editar-config"
                onClick={() => abrirModal(salaSeleccionada)}
                disabled={!puedeEditar}
              >
                Editar configuración
              </button>
            </div>

            {avisoEdicion !== null && (
              <p className="panel-mapa_aviso" role="note">{avisoEdicion}</p>
            )}

            <MapaSala
              asientos={asientosDeLaSala}
              capacidad={salaSeleccionada.capacidad}
              estado={estadoAsientos}
            />

          </div>
        )}
      </main>

      <AdminModal
        isOpen={modalAbierto}
        onClose={() => { if (!guardando) cerrarModal(); }}
        titulo={salaAEditar ? 'Editar configuración' : 'Nueva sala'}
      >
        <SalaForm
          sala={salaAEditar}
          asientosDeSala={salaAEditar ? asientosDeLaSala : []}
          guardando={guardando}
          progreso={progreso}
          onGuardar={guardarSala}
          onCancelar={cerrarModal}
        />
      </AdminModal>

      <VentanaEmergente
        abierta={errorGuardar !== null}
        titulo="No se pudo guardar la sala"
        mensaje={errorGuardar}
        onConfirmar={() => setErrorGuardar(null)}
      />
    </div>
  );
};

export default AdminSalasView;