const claseAviso = 'm-0 rounded-xl border border-solid px-4 py-3 text-sm';
const claseError = `${claseAviso} border-red-400/40 bg-red-400/10 text-red-300`;

// Avisos de la reserva de butacas. El de la hora solo aparece si el carrito tiene butacas.
const AvisoReservaButacas = ({ carrito, items }) => {
  const hayButacas = items.some((item) => item.tipo === 'BUTACA');

  return (
    <>
      {carrito?.vencido && (
        <p role="alert" className={claseError}>
          Pasaron más de 5 minutos sin confirmar la compra y el carrito se vació. Volvé a elegir tus
          butacas y productos.
        </p>
      )}

      {hayButacas && carrito.expiraEn && (
        <p className={`${claseAviso} border-white/10 bg-white/5 text-gray-300`}>
          Las butacas quedan reservadas hasta las {carrito.expiraEn.slice(11, 16)} hs. Confirmá la
          compra antes de esa hora.
        </p>
      )}
    </>
  );
};

export default AvisoReservaButacas;
