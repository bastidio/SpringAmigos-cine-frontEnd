import { useState, useEffect } from 'react';
import TarjetaResumen from '../../components/admin/ordenes/TarjetaResumen'; 
import AlertaStockWidget from '../../components/admin/dashboard/AlertaStockWidget';
import FuncionesHoyWidget from '../../components/admin/dashboard/FuncionesHoyWidget';
import UltimasOrdenesWidget from '../../components/admin/dashboard/UltimasOrdenesWidget';

const AdminDashboardView = () => {
  const [datos, setDatos] = useState({
    ordenes: [],
    productos: [],
    funciones: []
  });

  const [cargando, setCargando] = useState(true);

  const cargarDatosDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const opciones = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [resOrdenes, resProductos] = await Promise.allSettled([
        fetch('http://localhost:4002/ordenes', opciones),
        fetch('http://localhost:4002/productos', opciones)
      ]);

      const ordenesData = (resOrdenes.status === 'fulfilled' && resOrdenes.value.ok) ? await resOrdenes.value.json() : [];
      const productosData = (resProductos.status === 'fulfilled' && resProductos.value.ok) ? await resProductos.value.json() : [];

      setDatos({
        ordenes: ordenesData,
        productos: productosData,
        funciones: [] 
      });
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // Cálculos actualizados apuntando a los estados correctos
  const ingresosDelMes = datos.ordenes
    .filter(o => o.estado === 'CONFIRMADA')
    .reduce((acc, curr) => acc + curr.total, 0);
    
  const ordenesCanceladas = datos.ordenes.filter(o => o.estado === 'CANCELADA').length;

  if (cargando) return <div className="texto-muted">Cargando métricas del sistema...</div>;

  return (
    <div className="dashboard-grid">
      <div className="admin-view-header">
        <h1 className="admin-view-title">Panel de Control</h1>
      </div>

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Ingresos Totales" valor={`$${ingresosDelMes}`} />
        <TarjetaResumen titulo="Órdenes Canceladas" valor={ordenesCanceladas} />
        <TarjetaResumen titulo="Total Órdenes" valor={datos.ordenes.length} />
        <TarjetaResumen titulo="Productos en Kiosco" valor={datos.productos.length} />
      </div>

      <div className="dashboard-fila-dividida">
        <FuncionesHoyWidget funciones={datos.funciones} />
        <AlertaStockWidget productos={datos.productos} />
      </div>

      <UltimasOrdenesWidget ordenes={datos.ordenes} />
    </div>
  );
};

export default AdminDashboardView;