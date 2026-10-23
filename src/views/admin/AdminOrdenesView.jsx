import { useState, useEffect } from 'react';
import TarjetaResumen from '../../components/admin/ordenes/TarjetaResumen';
import OrdenesTable from '../../components/admin/ordenes/OrdenesTable';
import PanelDetalleOrden from '../../components/admin/ordenes/PanelDetalleOrden';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminOrdenesView = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(null);
  
  // Solo guardamos el ID para cancelar
  const [ordenACancelar, setOrdenACancelar] = useState(null); 

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4002/ordenes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
      
      const data = await response.json(); 
      setOrdenes(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const confirmarCancelacion = async () => {
    if (!ordenACancelar) return;

    try {
      const token = localStorage.getItem('token');

      // Pegamos directo a tu endpoint de cancelar con PUT
      const response = await fetch(`http://localhost:4002/ordenes/${ordenACancelar}/cancelar`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`Falló la actualización: ${response.status}`);

      setOrdenes(ordenes.map(o => o.id === ordenACancelar ? { ...o, estado: 'CANCELADA' } : o));
      setOrdenACancelar(null); 
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  const ordenesFiltradas = ordenes.filter(o => {
    const coincideEstado = filtroEstado === 'Todas' || o.estado === filtroEstado;
    const coincideBusqueda = o.id.toString().includes(busqueda);
    return coincideEstado && coincideBusqueda;
  });

  const totalIngresos = ordenes.filter(o => o.estado === 'CONFIRMADA').reduce((acc, curr) => acc + curr.total, 0);
  const confirmadasCount = ordenes.filter(o => o.estado === 'CONFIRMADA').length;

  return (
    <div>
      <div className="admin-view-header">
        <div>
           <h1 className="admin-view-title">Gestión de Órdenes</h1>
        </div>
      </div>

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Total Órdenes" valor={ordenes.length} />
        <TarjetaResumen titulo="Confirmadas" valor={confirmadasCount} />
        <TarjetaResumen titulo="Ingresos" valor={`$${totalIngresos}`} />
      </div>

      <div className="barra-busqueda-container">
        <input 
          type="text" 
          className="barra-busqueda-input" 
          placeholder="Buscar por ID de orden..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="filtros-categorias-container">
        {['Todas', 'CONFIRMADA', 'CANCELADA'].map(estado => (
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
        onCancelarOrden={(id) => setOrdenACancelar(id)} 
      />

      <AdminModal isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} titulo={`Orden #${ordenActiva?.id}`}>
        <PanelDetalleOrden orden={ordenActiva} />
      </AdminModal>

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