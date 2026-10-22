import { useState, useEffect } from 'react';

const ControlStockInline = ({ productoId, stockInicial, onActualizarStock, variante = 'compacto' }) => {
  const [stock, setStock] = useState(stockInicial);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setStock(stockInicial);
  }, [stockInicial]);

  const manejarCambio = async (nuevoStock) => {
    if (nuevoStock < 0) return;
    setCargando(true);
    setStock(nuevoStock);
    
    await onActualizarStock(productoId, nuevoStock);
    
    setCargando(false);
  };

  return (
    <div className={`kiosco-stock-control--${variante}`}>
      <button 
        disabled={cargando || stock <= 0} 
        onClick={() => manejarCambio(stock - 1)}
        className={`kiosco-stock-control__boton--${variante}`}
      >
        -
      </button>
      
      <span className={`kiosco-stock-control__valor--${variante}`}>
        {cargando ? '...' : stock}
      </span>
      
      <button 
        disabled={cargando} 
        onClick={() => manejarCambio(stock + 1)}
        className={`kiosco-stock-control__boton--${variante}`}
      >
        +
      </button>
    </div>
  );
};

export default ControlStockInline;