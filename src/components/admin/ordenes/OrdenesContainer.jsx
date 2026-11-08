import { useState, useEffect } from 'react';
import TarjetaResumen from './TarjetaResumen';
import OrdenesTable from './OrdenesTable';
import PanelDetalleOrden from './PanelDetalleOrden';
import AdminModal from '../ui/AdminModal';

const AdminOrdenesView = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(null);

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
      />

      <AdminModal isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} titulo={`Orden #${ordenActiva?.id}`}>
        <PanelDetalleOrden orden={ordenActiva} />
      </AdminModal>
    </div>
  );
};

export default AdminOrdenesView;