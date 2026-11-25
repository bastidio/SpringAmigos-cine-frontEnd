import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductosAdmin, createProducto, updateProducto, actualizarStock, reactivarProducto, deleteProducto } from '../../../redux/productosSlice';
import { fetchCategorias } from '../../../redux/categoriasSlice';
import KioscoTable from './KioscoTable';
import KioscoForm from './KioscoForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const AdminKioscoView = () => {
  const dispatch = useDispatch();
  const { itemsAdmin: productos, itemsAdminEstado, error } = useSelector((state) => state.productos);
  const { items: categorias, itemsEstado: categoriasEstado, error: errorCategorias } = useSelector((state) => state.categorias);
  const [categoriaActivaId, setCategoriaActivaId] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  // Cada lista se pide solo si todavia no esta.
  useEffect(() => {
    if (itemsAdminEstado === 'inicial' && error === null) dispatch(fetchProductosAdmin());
  }, [dispatch, itemsAdminEstado, error]);

  useEffect(() => {
    if (categoriasEstado === 'inicial' && errorCategorias === null) dispatch(fetchCategorias());
  }, [dispatch, categoriasEstado, errorCategorias]);

  const manejarActualizacionStock = async (productoId, nuevoStock) => {
    const res = await dispatch(actualizarStock({ id: productoId, stock: nuevoStock }));
    if (res.error) setErrorAccion('No se pudo actualizar el stock.');
  };

  const cambiarActivo = async (accion, mensajeError) => {
    setProcesando(true);
    const res = await dispatch(accion);
    setProcesando(false);
    setProductoAEliminar(null);
    if (res.error) setErrorAccion(mensajeError);
  };

  const confirmarEliminar = () =>
    cambiarActivo(deleteProducto(productoAEliminar.id), 'No se pudo eliminar el producto.');

  const manejarReactivar = (producto) =>
    cambiarActivo(reactivarProducto(producto.id), 'No se pudo reactivar el producto.');

  const manejarGuardar = async (formData) => {
    const payload = {
  nombre: formData.nombre,
  descripcion: formData.descripcion,
  precio: Number(formData.precio) || 0,
  stock: Number(formData.stock) || 0,
  descuento: Number(formData.descuento) || 0,
  categoriaId: Number(formData.categoria_id) || Number(formData.categoriaId) || 0,
  imagenes: formData.imagenes
};

    setErrorGuardar(null);
    const res = await dispatch(productoEditando ? updateProducto({ ...payload, id: productoEditando.id }) : createProducto(payload));
    if (res.error) {
      setErrorGuardar('No se pudo guardar el producto. Revisá que los datos estén completos y sean válidos.');
      return;
    }
    cerrarModal();
  };

  const abrirModal = (producto = null) => {
    setProductoEditando(producto);
    setErrorGuardar(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setProductoEditando(null);
    setErrorGuardar(null);
    setModalAbierto(false);
  };

  const productosFiltrados = categoriaActivaId === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria?.id === categoriaActivaId);
    
  return (
    <div>
      <div className="admin-view-header">
        <div>
           <h1 className="admin-view-title">Gestión de Kiosco</h1>
           <p className="kiosco-subtitulo">{productos.length} productos actuales</p>
        </div>
        <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nuevo Producto</BotonAccion>
      </div>

      <div className="filtros-categorias-container">
        <button 
          className={`btn-filtro-dia ${categoriaActivaId === 'Todos' ? 'activo' : ''}`}
          onClick={() => setCategoriaActivaId('Todos')}
        >
          Todos
        </button>
        
        {categorias.map(cat => (
          <button 
            key={cat.id} 
            className={`btn-filtro-dia ${categoriaActivaId === cat.id ? 'activo' : ''}`}
            onClick={() => setCategoriaActivaId(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <KioscoTable 
        productos={productosFiltrados} 
        onEditar={abrirModal} 
        onActualizarStock={manejarActualizacionStock}
        onEliminar={setProductoAEliminar}
        onReactivar={manejarReactivar}
      />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={productoEditando ? 'Editar Producto' : 'Nuevo Producto'}>
        {errorGuardar && (
          <p role="alert" className="pagina_mensaje pagina_mensaje--error">{errorGuardar}</p>
        )}
        <KioscoForm 
          productoAEditar={productoEditando} 
          categorias={categorias} 
          onGuardar={manejarGuardar} 
          onCancelar={cerrarModal} 
        />
      </AdminModal>

      <VentanaEmergente
        abierta={productoAEliminar !== null}
        variante="peligro"
        titulo="Eliminar producto"
        mensaje={`¿Eliminar ${productoAEliminar?.nombre ?? ''}? Va a dejar de mostrarse en el kiosco.`}
        textoConfirmar="Eliminar"
        ocupado={procesando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setProductoAEliminar(null)}
      />

      <VentanaEmergente
        abierta={errorAccion !== null}
        titulo="No se pudo completar"
        mensaje={errorAccion}
        onConfirmar={() => setErrorAccion(null)}
      />
    </div>
  );
};

export default AdminKioscoView;