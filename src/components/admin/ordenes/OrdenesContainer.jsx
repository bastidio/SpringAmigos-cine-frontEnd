import { useState, useEffect } from 'react';
import TarjetaResumen from './TarjetaResumen';
import OrdenesTable from './OrdenesTable';
import OrdenForm from './OrdenForm';
import PanelDetalleOrden from './PanelDetalleOrden';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';

const AdminOrdenesView = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(null);
  const [errorOperacion, setErrorOperacion] = useState(null);
  
  const [ordenACancelar, setOrdenACancelar] = useState(null);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:4002/ordenes', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor devolvió HTML. Asegurate de usar http://localhost:4002/ordenes");
      }

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const solicitarCancelacion = (id) => {
    setOrdenACancelar(id);
  };

const confirmarCancelacion = async () => {
    if (!ordenACancelar) return;
    setErrorOperacion(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:4002/ordenes/${ordenACancelar}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ estado: 'CANCELADA' })
      });

      if (!response.ok) {
        const datos = await response.json().catch(() => null);
        const mensajeError = datos?.message || "No se pudo cancelar la orden.";
        throw new Error(mensajeError);
      }

      setOrdenes(ordenes.map(o => o.id === ordenACancelar ? { ...o, estado: 'CANCELADA' } : o));
      setOrdenACancelar(null);
    } catch (error) {
      console.error("Error al cancelar:", error);
      setErrorOperacion(error.message);
    }
  };

  const manejarGuardarFormulario = async (datosForm) => {
    if (!ordenActiva) return;
    setErrorOperacion(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:4002/ordenes/${ordenActiva.id}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ estado: datosForm.estado })
      });

      if (!response.ok) {
        const datos = await response.json().catch(() => null);
        const mensajeError = datos?.message || "No se pudo actualizar el estado de la orden.";
        throw new Error(mensajeError);
      }

      setOrdenes(ordenes.map(o => o.id === ordenActiva.id ? { ...o, estado: datosForm.estado } : o));
      setModalFormAbierto(false);
    } catch (error) {
      console.error("Error guardando orden:", error);
      setErrorOperacion(error.message);
    }
  };

  const ordenesFiltradas = ordenes.filter(o => {
    const coincideEstado = filtroEstado === 'Todas' || o.estado === filtroEstado;
    const busquedaLower = busqueda.toLowerCase();
    const coincideBusqueda = 
      o.usuario?.nombre?.toLowerCase().includes(busquedaLower) || 
      o.id.toString().includes(busquedaLower);
    
    return coincideEstado && coincideBusqueda;
  });

  const totalIngresos = ordenes.filter(o => o.estado === 'COMPLETADA' || o.estado === 'CONFIRMADA').reduce((acc, curr) => acc + curr.total, 0);
  const pendientesCount = ordenes.filter(o => o.estado === 'PENDIENTE').length;
  return (
    <div>
      <div className="admin-view-header">
        <div>
           <h1 className="admin-view-title">Gestión de Órdenes</h1>
        </div>
      </div>

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Total Órdenes" valor={ordenes.length} />
        <TarjetaResumen titulo="Pendientes" valor={pendientesCount} />
        <TarjetaResumen titulo="Ingresos (Confirmadas)" valor={`$${totalIngresos.toLocaleString('es-AR')}`} />
      </div>

      <div className="barra-busqueda-container">
        <input 
          type="text" 
          className="barra-busqueda-input" 
          placeholder="Buscar por cliente o ID de orden..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="filtros-categorias-container">
        {['Todas', 'PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'].map(estado => (
          <button 
            key={estado}
            className={`btn-filtro-dia ${filtroEstado === estado ? 'activo' : ''}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      <OrdenesTable 
        ordenes={ordenesFiltradas} 
        onVerDetalle={(orden) => { setOrdenActiva(orden); setModalDetalleAbierto(true); }}
        onEditar={(orden) => { setOrdenActiva(orden); setModalFormAbierto(true); }}
        onCancelarOrden={solicitarCancelacion} 
      />

      <AdminModal isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} titulo={`Orden #${ordenActiva?.id}`}>
        <PanelDetalleOrden orden={ordenActiva} />
      </AdminModal>

      <AdminModal 
        isOpen={modalFormAbierto} 
        onClose={() => { setModalFormAbierto(false); setErrorOperacion(null); }} 
        titulo="Editar Estado de Orden"
      >
        {errorOperacion && (
          <div className="admin-error-mensaje">
            {errorOperacion}
          </div>
        )}
        <OrdenForm 
          ordenAEditar={ordenActiva} 
          onGuardar={manejarGuardarFormulario}
          onCancelar={() => { setModalFormAbierto(false); setErrorOperacion(null); }} 
        />
      </AdminModal>

      <AdminModal 
        isOpen={ordenACancelar !== null} 
        onClose={() => { setOrdenACancelar(null); setErrorOperacion(null); }} 
        titulo="Confirmar Cancelación"
      >
        <div>
          {errorOperacion && (
            <div className="admin-error-mensaje">
              {errorOperacion}
            </div>
          )}
          <p className="modal-confirmacion-texto">
            ¿Estás seguro de que querés cancelar la orden #{ordenACancelar}? Esta acción no se puede deshacer.
          </p>
          <div className="admin-form-actions">
            <BotonAccion variante="secundario" onClick={() => { setOrdenACancelar(null); setErrorOperacion(null); }}>
              No, volver
            </BotonAccion>
            <button className="btn-peligro" onClick={confirmarCancelacion}>
              Sí, cancelar orden
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminOrdenesView;