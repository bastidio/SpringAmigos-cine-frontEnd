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

      const [resProd, resCat] = await Promise.all([
        fetch('/productos', opciones),
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

  const manejarCambioEstado = async (producto) => {
    const nuevoEstado = !producto.activo;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/productos/${producto.id}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ activo: nuevoEstado })
      });
      
      setProductos(productos.map(p => 
        p.id === producto.id ? { ...p, activo: nuevoEstado } : p
      ));
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const manejarGuardar = async (formData) => {
    const payload = {
      ...formData,
      categoria: { id: formData.categoria_id } 
    };

    try {
      const url = productoEditando ? `/productos/${productoEditando.id}` : '/productos';
      const method = productoEditando ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');

      await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

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