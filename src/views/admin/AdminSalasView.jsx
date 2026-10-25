// src/views/admin/AdminSalasView.jsx
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SalasList from '../../components/admin/salas/SalasList';
import SalaForm from '../../components/admin/salas/SalaForm';
import GenerarButacasForm from '../../components/admin/salas/GenerarButacasForm';
import { butacasFaltantes } from '../../components/admin/salas/butacasFaltantes';
import AdminModal from '../../components/admin/ui/AdminModal';
import VentanaEmergente from '../../components/ui/VentanaEmergente';
import MapaSala from '../../components/admin/salas/MapaSala';

const AdminSalasView = () => {
  const { token } = useOutletContext();
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [salaAEditar, setSalaAEditar] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [estadoAsientos, setEstadoAsientos] = useState('cargando');
  const [modalButacas, setModalButacas] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(null);
  const [errorButacas, setErrorButacas] = useState(null);
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

  const sincronizarCapacidad = async (sala, total) => {
    if (total === sala.capacidad) return;

    try {
      const response = await fetch(`/salas/${sala.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: sala.nombre, capacidad: total }),
      });

      if (!response.ok) {
        throw new Error(`error ${response.status}`);
      }

      await cargarSalas(sala.id);
    } catch (error) {
      setErrorButacas(
        `Las butacas se crearon, pero no se pudo actualizar la capacidad de la sala a ${total} (${error.message}). Probá cambiarla con "Editar configuración".`
      );
    }
  };

  const generarButacas = async ({ filas, porFila }) => {
    const sala = salaSeleccionada;
    const salaAsientos = asientos.filter((asiento) => asiento.sala?.id === sala.id);
    const nuevas = butacasFaltantes(salaAsientos, filas, porFila);
    let hechas = 0;

    setGenerando(true);
    setProgreso({ hechas, total: nuevas.length });

    try {
      for (let fila = 1; fila <= filas; fila++) {
        const deLaFila = nuevas.filter((butaca) => butaca.fila === fila);

        await Promise.all(
          deLaFila.map(async (butaca) => {
            const response = await fetch('/asientos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ salaId: sala.id, fila: butaca.fila, numero: butaca.numero }),
            });

            if (!response.ok) {
              throw new Error(
                response.status === 401 || response.status === 403
                  ? 'Tu sesión de administrador venció o no tiene permisos. Volvé a iniciar sesión.'
                  : `El servidor rechazó una butaca (error ${response.status}).`
              );
            }
          })
        );

        hechas += deLaFila.length;
        setProgreso({ hechas, total: nuevas.length });
      }

      await sincronizarCapacidad(sala, salaAsientos.length + nuevas.length);
      setModalButacas(false);
    } catch (error) {
      setModalButacas(false);
      setErrorButacas(
        `${error.message} Se crearon ${hechas} de ${nuevas.length} butacas; al volver a generar se completan solo las que faltan.`
      );
    } finally {
      setGenerando(false);
      setProgreso(null);
      setVersionAsientos((version) => version + 1);
    }
  };

  const abrirModal = (sala = null) => {
    setSalaAEditar(sala);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setSalaAEditar(null);
    setModalAbierto(false);
  };

  const manejarGuardar = async (formData) => {
    const metodo = salaAEditar ? 'PUT' : 'POST';
    const url = salaAEditar ? `/salas/${salaAEditar.id}` : '/salas';

    try {
      const response = await fetch(url, {
        method: metodo,
        // Crear y editar salas es solo para ADMIN: sin el token el back responde 401.
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          capacidad: Number(formData.capacidad),
        }),
      });

      if (!response.ok) {
        throw new Error(`No se pudo guardar la sala (${response.status})`);
      }

      const salaId = salaAEditar?.id;
      cerrarModal();
      await cargarSalas(salaId);
    } catch (error) {
      // Antes era un window.alert: ahora se muestra en la VentanaEmergente.
      setErrorGuardar(error.message);
    }
  };

  const asientosDeLaSala = salaSeleccionada
    ? asientos.filter((asiento) => asiento.sala?.id === salaSeleccionada.id)
    : [];
  const salaTieneButacas = asientosDeLaSala.length > 0;

  return (
    <div className="admin-salas-contenedor">
      
      {/* COLUMNA IZQUIERDA: Botones */}
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
          <button className="btn-nueva-sala" onClick={() => abrirModal()}>
            + Nueva sala
          </button>
        </div>

        {salaSeleccionada && (
          <div className="panel-mapa">
            <div className="panel-mapa-header">
              <div>
                <h2 className="panel-mapa-titulo">{salaSeleccionada.nombre}</h2>
                <p className="panel-mapa-subtitulo">{salaSeleccionada.capacidad} butacas totales</p>
              </div>
              <div className="panel-mapa-acciones">
                <button
                  type="button"
                  className="btn-editar-config"
                  onClick={() => abrirModal(salaSeleccionada)}
                >
                  Editar configuración
                </button>
                <button
                  type="button"
                  className="btn-nueva-sala"
                  onClick={() => setModalButacas(true)}
                  disabled={estadoAsientos !== 'listo'}
                >
                  {salaTieneButacas ? 'Completar butacas' : 'Generar butacas'}
                </button>
              </div>
            </div>

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
        onClose={cerrarModal}
        titulo={salaAEditar ? 'Editar sala' : 'Nueva sala'}
      >
        <SalaForm
          salaAEditar={salaAEditar}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </AdminModal>

      <AdminModal
        isOpen={modalButacas}
        onClose={() => { if (!generando) setModalButacas(false); }}
        titulo={salaTieneButacas ? 'Completar butacas' : 'Generar butacas'}
      >
        {salaSeleccionada && (
          <GenerarButacasForm
            sala={salaSeleccionada}
            asientosDeSala={asientosDeLaSala}
            generando={generando}
            progreso={progreso}
            onGenerar={generarButacas}
            onCancelar={() => setModalButacas(false)}
          />
        )}
      </AdminModal>

      <VentanaEmergente
        abierta={errorButacas !== null}
        titulo="No se pudieron generar las butacas"
        mensaje={errorButacas}
        onConfirmar={() => setErrorButacas(null)}
      />

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