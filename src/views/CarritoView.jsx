import CarritoMenu from '../components/carrito/CarritoMenu';




const CarritoView = ({ abierto, cantidad, onAlternar, onCerrar, onNavegar }) => {
  return (
    <CarritoMenu
      abierto={abierto}
      cantidad={cantidad}
      onAlternar={onAlternar}
      onCerrar={onCerrar}
      onNavegar={onNavegar}
    />
  );
};

export default CarritoView;
