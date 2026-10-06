import { useEffect, useState } from 'react';
import CategoriaTabs from './CategoriaTabs';
import ProductoCard from './ProductoCard';
import './Kiosco.css';

// Componente padre del kiosco: es el unico que tiene estado y logica.
// Le pide los productos al backend, los guarda en un estado local y se los
// pasa a los hijos por props.
const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('Todo');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Efecto secundario: pedirle los productos al back. Array de dependencias
  // vacio: se ejecuta una sola vez, cuando el componente se monta.
  // GET /productos es publico y ya devuelve solo los productos activos.
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

  // Primero "por las malas": cargando y error.
  if (cargando) {
    return <p className="pagina__mensaje">Cargando kiosco...</p>;
  }

  if (error !== null) {
    return <p className="pagina__mensaje pagina__mensaje--error">{error}</p>;
  }

  // Las categorias salen de los productos que mando el back.
  // Set no admite repetidos, asi cada categoria aparece una sola vez.
  const categorias = [...new Set(productos.map((p) => p.categoria.nombre))];

  // Se filtra sobre lo que ya esta guardado: no hace falta volver a pedirle
  // nada al back. filter devuelve un array nuevo, el estado no se toca.
  const visibles = productos.filter((p) => {
    return categoria === 'Todo' || p.categoria.nombre === categoria;
  });

  return (
    <div className="kiosco">
      <h1 className="kiosco__titulo">Kiosco & Candy Bar</h1>
      <p className="kiosco__bajada">Armá tu combo perfecto antes de entrar a la sala.</p>

      <CategoriaTabs categorias={categorias} seleccionada={categoria} cambiar={setCategoria} />

      {visibles.length === 0 ? (
        <p className="pagina__mensaje">Todavía no hay productos para mostrar.</p>
      ) : (
        <div className="kiosco__grid">
          {visibles.map((producto) => (
            <ProductoCard
              key={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              categoria={producto.categoria.nombre}
              precio={producto.precio}
              descuento={producto.descuento}
              stock={producto.stock}
              imagen={producto.imagenes.length > 0 ? producto.imagenes[0].url : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductoList;
