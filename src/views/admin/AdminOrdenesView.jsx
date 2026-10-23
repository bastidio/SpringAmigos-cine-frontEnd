import { useState, useEffect } from 'react';
import TarjetaResumen from '../../components/admin/ordenes/TarjetaResumen';
import OrdenesTable from '../../components/admin/ordenes/OrdenesTable';
import OrdenForm from '../../components/admin/ordenes/OrdenForm';
import PanelDetalleOrden from '../../components/admin/ordenes/PanelDetalleOrden';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminOrdenesView = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(null);
  
  // NUEVO ESTADO: Guarda el ID de la orden que se quiere cancelar
  const [ordenACancelar, setOrdenACancelar] = useState(null);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. TIENE que ser la ruta absoluta a tu backend
      const response = await fetch('http://localhost:4002/ordenes', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      
      // 2. Validación antibalas: Si no es JSON, frenamos el código
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor devolvió HTML. Asegurate de usar http://localhost:4002/ordenes");
      }

      // 3. Validamos que el backend no haya rechazado la petición (401, 403, 404)
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      // 4. Recién acá parseamos, ya seguros de que es un JSON válido
      const data = await response.json(); 
      setOrdenes(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 1. Abre el modal de confirmación en lugar del window.confirm
  const solicitarCancelacion = (id) => {
    setOrdenACancelar(id);
  };

  // 2. Ejecuta la cancelación real cuando se confirma en el modal
  const confirmarCancelacion = async () => {
    if (!ordenACancelar) return;

    try {
      const token = localStorage.getItem('token'); // 1. Recuperamos el token

      const response = await fetch(`/ordenes/${ordenACancelar}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 2. Agregamos el header
        },
        body: JSON.stringify({ estado: 'CANCELADA' })
      });

      if (!response.ok) throw new Error('Falló la actualización en el servidor');

      // Solo si el backend responde bien, actualizamos la tabla y cerramos el modal
      setOrdenes(ordenes.map(o => o.id === ordenACancelar ? { ...o, estado: 'CANCELADA' } : o));
      setOrdenACancelar(null); 
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  const manejarGuardarFormulario = async (datosForm) => {
    if (!ordenActiva) return;

    try {
      const token = localStorage.getItem('token'); // 1. Recuperamos el token

      const response = await fetch(`/ordenes/${ordenActiva.id}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 2. Agregamos el header
        },
        body: JSON.stringify({ estado: datosForm.estado })
      });

      if (!response.ok) throw new Error('Falló la actualización en el servidor');

      // Solo si el backend responde bien, actualizamos la tabla y cerramos el modal
      setOrdenes(ordenes.map(o => o.id === ordenActiva.id ? { ...o, estado: datosForm.estado } : o));
      setModalFormAbierto(false);
    } catch (error) {
      console.error("Error guardando orden:", error);
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

  // Las ordenes del checkout quedan CONFIRMADA: cuentan como ingresos igual que COMPLETADA.
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
        onCancelarOrden={solicitarCancelacion} // Pasamos la nueva función
      />

      <AdminModal isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} titulo={`Orden #${ordenActiva?.id}`}>
        <PanelDetalleOrden orden={ordenActiva} />
      </AdminModal>

      <AdminModal isOpen={modalFormAbierto} onClose={() => setModalFormAbierto(false)} titulo="Editar Estado de Orden">
        <OrdenForm 
          ordenAEditar={ordenActiva} 
          onGuardar={manejarGuardarFormulario}
          onCancelar={() => setModalFormAbierto(false)} 
        />
      </AdminModal>

      {/* NUEVO: Modal de confirmación para cancelar */}
      <AdminModal 
        isOpen={ordenACancelar !== null} 
        onClose={() => setOrdenACancelar(null)} 
        titulo="Confirmar Cancelación"
      >
        <div>
          <p className="modal-confirmacion-texto">
            ¿Estás seguro de que querés cancelar la orden #{ordenACancelar}? Esta acción no se puede deshacer.
          </p>
          <div className="admin-form-actions">
            <BotonAccion variante="secundario" onClick={() => setOrdenACancelar(null)}>
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