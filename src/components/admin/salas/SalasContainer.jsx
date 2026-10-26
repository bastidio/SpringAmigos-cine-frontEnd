
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SalasList from './SalasList';
import SalaForm from './SalaForm';
import { butacasFaltantes, butacasSobrantes, butacasTotales, agruparPorFila } from './calculoButacas';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';
import MapaSala from './MapaSala';

const mensajeDeError = (status, queSeIntentaba) => {
  if (status === 401 || status === 403) {
    return 'Tu sesión de administrador venció o no tiene permisos. Volvé a iniciar sesión.';
  }
  if (status === 409) {
    return 'La sala tiene funciones asignadas: su configuración no se puede modificar.';
  }
  return `El servidor rechazó ${queSeIntentaba} (error ${status}).`;
};

const AdminSalasView = () => {
  const { token } = useOutletContext();
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [salaAEditar, setSalaAEditar] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [estadoAsientos, setEstadoAsientos] = useState('cargando');
  const [funciones, setFunciones] = useState([]);
  const [estadoFunciones, setEstadoFunciones] = useState('cargando');
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState(null);
  const [versionAsientos, setVersionAsientos] = useState(0);

  const cargarSalas = async (salaIdSeleccionada = salaSeleccionada?.id) => {
    try {
      const response = await fetch('/salas');
      if (!response.ok) {
        throw new Error(`No se pudieron cargar las salas (${response.status})`);
      }

      const data = await response.json();
      setSalas(data);
      setSalaSeleccionada(
        data.find((sala) => sala.id === salaIdSeleccionada) ?? data[0] ?? null
      );
    } catch (error) {
      console.error('Error al cargar salas:', error);
    }
  };

  useEffect(() => {
    let activa = true;

    fetch('/salas')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las salas (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (!activa) return;
        setSalas(data);
        setSalaSeleccionada(data[0] ?? null);
      })
      .catch((error) => {
        if (activa) console.error('Error al cargar salas:', error);
      });

    return () => {
      activa = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/asientos', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las butacas (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setAsientos(data);
        setEstadoAsientos('listo');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Error al cargar las butacas:', error);
        setEstadoAsientos('error');
      });

    return () => controller.abort();
  }, [versionAsientos]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/funciones', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las funciones (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setFunciones(data);
        setEstadoFunciones('listo');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Error al cargar las funciones:', error);
        setEstadoFunciones('error');
      });

    return () => controller.abort();
  }, []);

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
    const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    let hechas = 0;
    let salaId = editando ? salaAEditar.id : null;
    let salaGuardada = false;

    setGuardando(true);
    setProgreso({ hechas, total });

    try {
      
      const respuestaSala = await fetch(editando ? `/salas/${salaAEditar.id}` : '/salas', {
        method: editando ? 'PUT' : 'POST',
        headers: cabeceras,
        body: JSON.stringify({ nombre, capacidad }),
      });
      if (!respuestaSala.ok) {
        throw new Error(mensajeDeError(respuestaSala.status, 'guardar la sala'));
      }
      salaGuardada = true;
      if (!editando) {
        salaId = (await respuestaSala.json()).id;
      }

      
      for (const deLaFila of agruparPorFila(nuevas)) {
        await Promise.all(
          deLaFila.map(async (butaca) => {
            const response = await fetch('/asientos', {
              method: 'POST',
              headers: cabeceras,
              body: JSON.stringify({ salaId, fila: butaca.fila, numero: butaca.numero }),
            });
            if (!response.ok) {
              throw new Error(mensajeDeError(response.status, 'una butaca'));
            }
          })
        );
        hechas += deLaFila.length;
        setProgreso({ hechas, total });
      }

      
      for (const deLaFila of agruparPorFila(sobrantes)) {
        await Promise.all(
          deLaFila.map(async (butaca) => {
            const response = await fetch(`/asientos/${butaca.id}`, {
              method: 'DELETE',
              headers: cabeceras,
            });
            if (!response.ok) {
              throw new Error(mensajeDeError(response.status, 'quitar una butaca'));
            }
          })
        );
        hechas += deLaFila.length;
        setProgreso({ hechas, total });
      }

      cerrarModal();
    } catch (error) {
      if (salaGuardada) {
        
        cerrarModal();
        setErrorGuardar(
          `${error.message} La sala se guardó y se procesaron ${hechas} de ${total} butacas; al volver a guardar se completa lo que falte.`
        );
      } else {
        setErrorGuardar(error.message);
      }
    } finally {
      setGuardando(false);
      setProgreso(null);
      setVersionAsientos((version) => version + 1);
      if (salaId !== null) await cargarSalas(salaId);
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