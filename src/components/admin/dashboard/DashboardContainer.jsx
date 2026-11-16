import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenes } from '../../../redux/ordenesSlice';
import { fetchProductos } from '../../../redux/productosSlice';
import { fetchFunciones } from '../../../redux/carteleraSlice';
import TarjetaResumen from '../ordenes/TarjetaResumen';
import AlertaStockWidget from './AlertaStockWidget';
import FuncionesHoyWidget from './FuncionesHoyWidget';
import UltimasOrdenesWidget from './UltimasOrdenesWidget';

const DashboardContainer = () => {
  const dispatch = useDispatch();
  const { items: ordenes, loading: cargandoOrdenes } = useSelector((state) => state.ordenes);
  const { items: productos, loading: cargandoProductos } = useSelector((state) => state.productos);
  const { funciones, loading: cargandoFunciones } = useSelector((state) => state.cartelera);
  const cargando = cargandoOrdenes || cargandoProductos || cargandoFunciones;

  // Montaje: los tres pedidos en paralelo.
  useEffect(() => {
    dispatch(fetchOrdenes());
    dispatch(fetchProductos());
    dispatch(fetchFunciones());
  }, [dispatch]);

  const fecha = new Date();
  const hoy = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  const funcionesDeHoy = funciones.filter((f) => f.horario?.startsWith(hoy));

  const ingresosDelMes = ordenes.reduce((acc, curr) => acc + curr.total, 0);

  if (cargando) return <div className="texto-muted">Cargando métricas del sistema...</div>;

  return (
    <div className="dashboard-grid">
      <div className="admin-view-header">
        <h1 className="admin-view-title">Panel de Control</h1>
      </div>

      <div className="tarjetas-resumen-grid">
        <TarjetaResumen titulo="Ingresos Totales" valor={`$${ingresosDelMes.toLocaleString('es-AR')}`} />
        <TarjetaResumen titulo="Productos en Kiosco" valor={productos.length} />
      </div>

      <div className="dashboard-fila-dividida">
        <FuncionesHoyWidget funciones={funcionesDeHoy} />
        <AlertaStockWidget productos={productos} />
      </div>

      <UltimasOrdenesWidget ordenes={ordenes} />
    </div>
  );
};

export default DashboardContainer;
