// Aviso de la hora de reserva. Solo aparece si el carrito tiene butacas.
const AvisoReservaButacas = ({ carrito, items }) => {
  if (!items.some((item) => item.tipo === 'BUTACA') || !carrito.expiraEn) return null;

  return (
    <p className="m-0 rounded-xl border border-solid border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
      Las butacas quedan reservadas hasta las {carrito.expiraEn.slice(11, 16)} hs. Confirmá la
      compra antes de esa hora.
    </p>
  );
};

export default AvisoReservaButacas;
