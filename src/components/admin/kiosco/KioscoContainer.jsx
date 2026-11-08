import { useState, useEffect } from 'react';
import KioscoTable from './KioscoTable';
import KioscoForm from './KioscoForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const AdminKioscoView = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const opciones = { headers: { 'Authorization': `Bearer ${token}` } };

      const [resProd, resCat] = await Promise.all([
        fetch('/productos?incluirInactivos=true', opciones),
        fetch('/categorias', opciones)
      ]);
      setProductos(await resProd.json());
      setCategorias(await resCat.json());
    } catch (error) {
      console.error("Error cargando base de datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarActualizacionStock = async (productoId, nuevoStock) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/productos/${productoId}/stock`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ stock: nuevoStock })
      });
      
      setProductos(productos.map(p => 
        p.id === productoId ? { ...p, stock: nuevoStock } : p
      ));
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  };

  const cambiarActivo = async (producto, metodo, ruta, mensajeError) => {
    setProcesando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/productos/${producto.id}${ruta}`, {
        method: metodo,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        setErrorAccion(`${mensajeError} (${response.status})`);
        return;
      }
      await cargarDatos();
    } catch (error) {
      console.error(mensajeError, error);
      setErrorAccion('No se pudo conectar con el servidor.');
    } finally {
      setProcesando(false);
      setProductoAEliminar(null);
    }
  };

  const confirmarEliminar = () =>
    cambiarActivo(productoAEliminar, 'DELETE', '', 'No se pudo eliminar el producto');

  const manejarReactivar = (producto) =>
    cambiarActivo(producto, 'PATCH', '/reactivar', 'No se pudo reactivar el producto');

  const manejarGuardar = async (formData) => {
    const payload = {
  nombre: formData.nombre,
  descripcion: formData.descripcion,
  precio: Number(formData.precio) || 0,
  stock: Number(formData.stock) || 0,
  descuento: Number(formData.descuento) || 0,
  categoriaId: Number(formData.categoria_id) || Number(formData.categoriaId) || 0,
  imagenes: formData.posterProducto ? [formData.posterProducto] : [],
  posterProducto: formData.posterProducto || null
};

    setErrorGuardar(null);
    try {
      
    
    const baseUrl = 'http://localhost:4002';
    const url = productoEditando 
      ? `${baseUrl}/productos/${productoEditando.id}` 
      : `${baseUrl}/productos`;
      
    const method = productoEditando ? 'PUT' : 'POST';
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const datos = await response.json().catch(() => null);
      const motivos = datos?.validationErrors ? Object.values(datos.validationErrors) : [];
      const mensaje = motivos.length > 0
        ? motivos.join(', ')
        : datos?.message || `No se pudo guardar el producto (${response.status})`;
      setErrorGuardar(mensaje);
      return;
    }

    cerrarModal();
    cargarDatos();
  } catch (error) {
    console.error("Error guardando producto:", error);
    setErrorGuardar('No se pudo conectar con el servidor.');
  }
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