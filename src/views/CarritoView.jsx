import CarritoMenu from '../components/carrito/CarritoMenu';

// "Carrito": el menu desplegable del icono del nav. Solo renderiza: la logica
// esta en CarritoMenu y CarritoDetalle. Las props que le pasa App las reenvia
// tal cual.
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
