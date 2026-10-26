

const AlertaStockWidget = ({ productos }) => {
  
  const bajoStock = productos.filter(p => p.stock < 20);

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <h2 className="dashboard-widget-titulo">⚠️ Alertas de Stock</h2>
      </div>
      
      {bajoStock.length === 0 ? (
        <p className="texto-muted">Todo el stock está en niveles óptimos.</p>
      ) : (
        <ul className="stock-lista">
          {bajoStock.map(p => (
            <li key={p.id} className="stock-item">
              <div className="stock-item-info">
                <span className="stock-item-nombre">{p.nombre}</span>
                <span className="stock-item-cantidad">Quedan {p.stock} u.</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertaStockWidget;