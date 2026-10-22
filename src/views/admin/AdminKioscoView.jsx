import { useState, useEffect } from 'react';
import KioscoTable from '../../components/admin/kiosco/KioscoTable';
import KioscoForm from '../../components/admin/kiosco/KioscoForm';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminKioscoView = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState('Todos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const opciones = { headers: { 'Authorization': `Bearer ${token}` } };

      const [resProd, resProdInactivos, resCat] = await Promise.all([
        fetch('http://localhost:4002/productos', opciones),
        fetch('http://localhost:4002/productos/inactivos', opciones),
        fetch('http://localhost:4002/categorias', opciones)
      ]);
      
      const activos = await resProd.json();
      const inactivos = resProdInactivos.ok ? await resProdInactivos.json() : [];
      setCategorias(await resCat.json());
      setProductos([...activos, ...inactivos]);
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
      const response = await fetch(`http://localhost:4002/productos/${productoId}/stock`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ stock: nuevoStock })
      });
      
      if (!response.ok) throw new Error("Error en servidor al actualizar stock");

      setProductos(productos.map(p => 
        p.id === productoId ? { ...p, stock: nuevoStock } : p
      ));
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  };

  const manejarCambioEstado = async (producto) => {
    try {
      const token = localStorage.getItem('token');
      const url = producto.activo 
        ? `http://localhost:4002/productos/${producto.id}` 
        : `http://localhost:4002/productos/${producto.id}/reactivar`;
      const method = producto.activo ? 'DELETE' : 'PATCH';

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Error en servidor al cambiar estado");

      setProductos(productos.map(p => 
        p.id === producto.id ? { ...p, activo: !producto.activo } : p
      ));
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const manejarGuardar = async (formData) => {
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio) || 0,
      stock: Number(formData.stock) || 0,
      descuento: Number(formData.descuento) || 0,
      categoriaId: Number(formData.categoria_id) || 0,
      imagenes: formData.imagenUrl ? [formData.imagenUrl] : []
    };

    try {
      const url = productoEditando 
        ? `http://localhost:4002/productos/${productoEditando.id}` 
        : 'http://localhost:4002/productos';
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

      if (!response.ok) throw new Error("Error al guardar en servidor");

      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  const abrirModal = (producto = null) => {
    setProductoEditando(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setProductoEditando(null);
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
        onCambiarEstado={manejarCambioEstado}
      />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={productoEditando ? 'Editar Producto' : 'Nuevo Producto'}>
        <KioscoForm 
          productoAEditar={productoEditando} 
          categorias={categorias} 
          onGuardar={manejarGuardar} 
          onCancelar={cerrarModal} 
        />
      </AdminModal>
    </div>
  );
};

export default AdminKioscoView;