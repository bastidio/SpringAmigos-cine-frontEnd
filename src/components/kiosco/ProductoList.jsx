import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { agregarItem, modificarCantidad, eliminarItem } from '../../redux/carritoSlice';
import { fetchProductos } from '../../redux/productosSlice';
import CategoriaTabs from './CategoriaTabs';
import ProductoCard from './ProductoCard';
import './Kiosco.css';

const elegirImagen = (producto) => {
  return producto.imagenes?.length > 0 ? producto.imagenes[0].url : null;
};




const ProductoList = () => {
  const { token } = useSelector((state) => state.usuario);
  const { carrito } = useSelector((state) => state.carrito);
  const dispatch = useDispatch();
  const { items: productos, itemsEstado, error } = useSelector((state) => state.productos);
  const [categoria, setCategoria] = useState('Todo');
  const navigate = useNavigate();

  const [ocupadoId, setOcupadoId] = useState(null);
  const [errorCarrito, setErrorCarrito] = useState(null);

  const itemDe = (producto) => {
    if (token === '') return undefined;
    return (carrito?.items ?? []).find(
      (item) => item.tipo === 'PRODUCTO' && item.referenciaId === producto.id
    );
  };

  // accion: el thunk a despachar; el carrito del store se actualiza en su fulfilled.
  const cambiarCarrito = async (producto, accion) => {
    if (token === '') {
      navigate('/login');
      return;
    }

    setOcupadoId(producto.id);
    setErrorCarrito(null);
    const res = await dispatch(accion);
    setOcupadoId(null);
    if (res.error) {
      setErrorCarrito(res.payload);
    }
  };

  const agregar = (producto) => {
    cambiarCarrito(producto, agregarItem({ productoId: producto.id, cantidad: 1 }));
  };

  const cambiarCantidad = (producto, cantidad) => {
    const item = itemDe(producto);
    if (item === undefined) return;

    cambiarCarrito(
      producto,
      cantidad === 0
        ? eliminarItem(item.itemId)
        : modificarCantidad({ itemId: item.itemId, cantidad })
    );
  };

  
  
  
  // Solo se piden si todavía no están.
  useEffect(() => {
    if (itemsEstado === 'inicial' && error === null) dispatch(fetchProductos());
  }, [dispatch, itemsEstado, error]);


  if (itemsEstado === 'cargando' && productos.length === 0) {
    return <p className="pagina_mensaje">Cargando kiosco...</p>;
  }

  if (error !== null) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudo cargar el kiosco. Revisá que el backend esté levantado.
      </p>
    );
  }

  
  
  const categorias = [...new Set(productos.map((p) => p.categoria.nombre))];

  
  
  const visibles = productos.filter((p) => {
    return categoria === 'Todo' || p.categoria.nombre === categoria;
  });

  return (
    <div className="kiosco">
      <h1 className="kiosco_titulo">Kiosco & Candy Bar</h1>
      <p className="kiosco_bajada">Armá tu combo perfecto antes de entrar a la sala</p>

      {errorCarrito !== null && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error">
          {errorCarrito}
        </p>
      )}

      <CategoriaTabs categorias={categorias} seleccionada={categoria} cambiar={setCategoria} />

      {visibles.length === 0 ? (
        <p className="pagina_mensaje">Todavía no hay productos para mostrar.</p>
      ) : (
        <div className="kiosco_grid">
          {visibles.map((producto) => (
            <ProductoCard
              key={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              categoria={producto.categoria.nombre}
              precio={producto.precio}
              descuento={producto.descuento}
              stock={producto.stock}
              imagen={elegirImagen(producto)}
              cantidad={itemDe(producto)?.cantidad ?? 0}
              ocupado={ocupadoId === producto.id}
              onAgregar={() => agregar(producto)}
              onCambiarCantidad={(cantidad) => cambiarCantidad(producto, cantidad)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductoList;
