import { useEffect, useState } from 'react';
import TarjetaResumen from '../ordenes/TarjetaResumen';
import AlertaStockWidget from './AlertaStockWidget';
import FuncionesHoyWidget from './FuncionesHoyWidget';
import UltimasOrdenesWidget from './UltimasOrdenesWidget';

const DashboardContainer = () => {
  const [datos, setDatos] = useState({
    ordenes: [],
    productos: [],
    funciones: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const opciones = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const fecha = new Date();
    const hoy = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

    Promise.allSettled([
      fetch('http://localhost:4002/ordenes', opciones),
      fetch('http://localhost:4002/productos', opciones),
      fetch(`http://localhost:4002/funciones?fecha=${hoy}`, opciones)
    ])
      .then(async ([resOrdenes, resProductos, resFunciones]) => {
        const ordenesData = (resOrdenes.status === 'fulfilled' && resOrdenes.value.ok)
          ? await resOrdenes.value.json()
          : [];
        const productosData = (resProductos.status === 'fulfilled' && resProductos.value.ok)
          ? await resProductos.value.json()
          : [];
        const funcionesData = (resFunciones.status === 'fulfilled' && resFunciones.value.ok)
          ? await resFunciones.value.json()
          : [];

        setDatos({
          ordenes: ordenesData,
          productos: productosData,
          funciones: funcionesData
        });
      })
      .catch(error => {
        console.error('Error cargando dashboard:', error);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

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

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Ingresos Totales" valor={`$${ingresosDelMes.toLocaleString('es-AR')}`} />
        <TarjetaResumen titulo="Órdenes Pendientes" valor={ordenesPendientes} />
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

export default DashboardContainer;
