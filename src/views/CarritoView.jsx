import CarritoMenu from '../components/carrito/CarritoMenu';




const CarritoView = ({ token, abierto, cantidad, onAlternar, onCerrar, onNavegar }) => {
  return (
    <CarritoMenu
      token={token}
      abierto={abierto}
      cantidad={cantidad}
      onAlternar={onAlternar}
      onCerrar={onCerrar}
      onNavegar={onNavegar}
    />
  );
};

export default CarritoView;
