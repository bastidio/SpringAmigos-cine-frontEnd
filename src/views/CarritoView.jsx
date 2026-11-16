import CarritoMenu from '../components/carrito/CarritoMenu';

const CarritoView = ({ abierto, cantidad, onAlternar, onCerrar, irA }) => {
  return (
    <CarritoMenu
      abierto={abierto}
      cantidad={cantidad}
      onAlternar={onAlternar}
      onCerrar={onCerrar}
      irA={irA}
    />
  );
};

export default CarritoView;
