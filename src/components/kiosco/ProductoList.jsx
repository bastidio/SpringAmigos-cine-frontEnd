import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';
import CategoriaTabs from './CategoriaTabs';
import ProductoCard from './ProductoCard';
import './Kiosco.css';

const elegirImagen = (producto) => {
  if (producto.posterProducto) {
    return producto.posterProducto;
  }
  return producto.imagenes?.length > 0 ? producto.imagenes[0].url : null;
};




const ProductoList = ({ token }) => {
  const { refrescarCantidad, version } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('Todo');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(null);
  const [ocupadoId, setOcupadoId] = useState(null);
  const [errorCarrito, setErrorCarrito] = useState(null);

  const itemDe = (producto) => {
    if (token === '') return undefined;
    return (carrito?.items ?? []).find(
      (item) => item.tipo === 'PRODUCTO' && item.referenciaId === producto.id
    );
  };

  const cambiarCarrito = async (producto, pedido) => {
    if (token === '') {
      navigate('/login');
      return;
    }

    setOcupadoId(producto.id);
    setErrorCarrito(null);
    try {
      await pedido();
      refrescarCantidad();
    } catch (err) {
      setOcupadoId(null);
      if (err.status === 401) {
        navigate('/login');
        return;
      }
      setErrorCarrito(
        err.status === 400 || err.status === 409
          ? `No se pudo agregar ${producto.nombre}: no hay stock suficiente o el carrito venció.`
          : err.message
      );
    }
  };

  const agregar = (producto) => {
    cambiarCarrito(producto, () =>
      apiFetch('/api/carritos/items', {
        method: 'POST',
        body: { productoId: producto.id, cantidad: 1 },
        token,
      })
    );
  };

  const cambiarCantidad = (producto, cantidad) => {
    const item = itemDe(producto);
    if (item === undefined) return;

    cambiarCarrito(producto, () =>
      cantidad === 0
        ? apiFetch(`/api/carritos/items/${item.itemId}`, { method: 'DELETE', token })
        : apiFetch(`/api/carritos/items/${item.itemId}`, {
            method: 'PUT',
            body: { cantidad },
            token,
          })
    );
  };

  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    apiFetch('/api/carritos', { token, signal: controller.signal })
      .then((data) => {
        setCarrito(data);
        setOcupadoId(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('No se pudo cargar el carrito en el kiosco', err);
        setOcupadoId(null);
      });

    return () => controller.abort();
  }, [token, version]);

  
  
  
  useEffect(() => {
    fetch('/productos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setError(null);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al mostrar los productos', error);
        setError('No se pudo cargar el kiosco. Revisá que el backend esté levantado.');
        setCargando(false);
      });
  }, []);

  
  if (cargando) {
    return <p className="pagina_mensaje">Cargando kiosco...</p>;
  }

  if (error !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{error}</p>;
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
