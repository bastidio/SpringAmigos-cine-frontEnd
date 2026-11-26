import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenes } from '../../../redux/ordenesSlice';
import TarjetaResumen from './TarjetaResumen';
import OrdenesTable from './OrdenesTable';
import PanelDetalleOrden from './PanelDetalleOrden';
import AdminModal from '../ui/AdminModal';

const AdminOrdenesView = () => {
  const dispatch = useDispatch();
  const { items: ordenes, itemsEstado, error } = useSelector((state) => state.ordenes);
  const [busqueda, setBusqueda] = useState('');
  
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(null);

  // Solo se piden si todavia no se pidieron
  useEffect(() => {
    if (itemsEstado === 'inicial' && error === null) dispatch(fetchOrdenes());
  }, [dispatch, itemsEstado, error]);

  const ordenesFiltradas = ordenes.filter(o => {
    const busquedaLower = busqueda.toLowerCase();
    const coincideBusqueda = 
      o.usuario?.nombre?.toLowerCase().includes(busquedaLower) || 
      o.id.toString().includes(busquedaLower);
    
    return coincideBusqueda;
  });

  const totalIngresos = ordenes.reduce((acc, curr) => acc + curr.total, 0);
  return (
    <div>
      <div className="admin-view-header">
        <div>
           <h1 className="admin-view-title">Gestión de Órdenes</h1>
        </div>
      </div>

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Total Órdenes" valor={ordenes.length} />
        <TarjetaResumen titulo="Ingresos"valor={`$${totalIngresos.toLocaleString('es-AR')}`} />
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