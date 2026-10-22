// src/views/admin/AdminSalasView.jsx
import { useState, useEffect } from 'react';
import SalasList from '../../components/admin/salas/SalasList';
import SalaForm from '../../components/admin/salas/SalaForm';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminSalasView = () => {
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [salaAEditar, setSalaAEditar] = useState(null);

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
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error al guardar la sala:', error);
      window.alert(error.message);
    }
  };

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
        />
      </aside>

      {/* COLUMNA DERECHA: Detalle y recuadro vacío */}
      <main className="salas-detalle">
        <div className="salas-acciones-header">
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
              <button
                className="btn-editar-config"
                onClick={() => abrirModal(salaSeleccionada)}
              >
                Editar configuración
              </button>
            </div>

            {/* --- RECUADRO VACÍO PARA BUTACAS --- */}
            <div className="mapa-placeholder">
              <p>
                Reemplazar este div entero por componente de Mapa.<br/><br/>
                La sala clickeada tiene el ID: <strong>{salaSeleccionada.id}</strong>
              </p>
            </div>
            {/* ---------------------------------------- */}

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
    </div>
  );
};

export default AdminSalasView;