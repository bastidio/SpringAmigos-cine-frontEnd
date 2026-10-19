import { useState } from 'react';


const ControlStockInline = ({ productoId, stockInicial, onActualizarStock }) => {
  const [stock, setStock] = useState(stockInicial);
  const [cargando, setCargando] = useState(false);

  const manejarCambio = async (nuevoStock) => {
    if (nuevoStock < 0) return;
    setCargando(true);
    setStock(nuevoStock);
    
    await onActualizarStock(productoId, nuevoStock);
    
    setCargando(false);
  };

  return (
    <div className="control-stock-container">
      <button 
        disabled={cargando} 
        onClick={() => manejarCambio(stock - 1)}
        className="control-stock-btn"
      >
        -
      </button>
      
      <span className="control-stock-valor">
        {cargando ? '...' : stock}
      </span>
      
      <button 
        disabled={cargando} 
        onClick={() => manejarCambio(stock + 1)}
        className="control-stock-btn"
      >
        +
      </button>
    </div>
  );
};

export default ControlStockInline;