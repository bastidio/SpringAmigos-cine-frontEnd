import { useState, useEffect } from 'react';
import TarjetaResumen from '../../components/admin/ordenes/TarjetaResumen'; // Reutilizamos tu tarjeta
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

      // 1. Obtenemos la fecha de hoy en formato YYYY-MM-DD (hora local)
      const fecha = new Date();
      const hoy = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

      // 2. Agregamos el fetch al endpoint de funciones pasando la fecha
      const [resOrdenes, resProductos, resFunciones] = await Promise.allSettled([
        fetch('http://localhost:4002/ordenes', opciones),
        fetch('http://localhost:4002/productos', opciones),
        fetch(`http://localhost:4002/funciones?fecha=${hoy}`, opciones)
      ]);

      // 3. Parseamos los datos
      const ordenesData = (resOrdenes.status === 'fulfilled' && resOrdenes.value.ok) ? await resOrdenes.value.json() : [];
      const productosData = (resProductos.status === 'fulfilled' && resProductos.value.ok) ? await resProductos.value.json() : [];
      const funcionesData = (resFunciones.status === 'fulfilled' && resFunciones.value.ok) ? await resFunciones.value.json() : [];

      // 4. Guardamos todo en el estado
      setDatos({
        ordenes: ordenesData,
        productos: productosData,
        funciones: funcionesData
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

  // Cálculos para las tarjetas superiores
  const ingresosDelMes = datos.ordenes
    .filter(o => o.estado === 'COMPLETADA' || o.estado === 'CONFIRMADA')
    .reduce((acc, curr) => acc + curr.total, 0);
    
  const ordenesPendientes = datos.ordenes.filter(o => o.estado === 'PENDIENTE').length;

  if (cargando) return <div className="texto-muted">Cargando métricas del sistema...</div>;

  return (
    <div className="dashboard-grid">
      <div className="admin-view-header">
        <h1 className="admin-view-title">Panel de Control</h1>
      </div>

      {/* 1. Tarjetas Superiores */}
      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Ingresos Totales" valor={`$${ingresosDelMes.toLocaleString('es-AR')}`} />
        <TarjetaResumen titulo="Órdenes Pendientes" valor={ordenesPendientes} />
        <TarjetaResumen titulo="Productos en Kiosco" valor={datos.productos.length} />
      </div>

      {/* 2. Fila Central Dividida */}
      <div className="dashboard-fila-dividida">
        <FuncionesHoyWidget funciones={datos.funciones} />
        <AlertaStockWidget productos={datos.productos} />
      </div>

      {/* 3. Fila Inferior (Ancho completo) */}
      <UltimasOrdenesWidget ordenes={datos.ordenes} />
    </div>
  );
};

export default AdminDashboardView;