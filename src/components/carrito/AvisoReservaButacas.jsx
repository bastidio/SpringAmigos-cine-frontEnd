import { useEffect, useState } from 'react';

// Segundos que faltan para expiraEn. Se calcula contra la hora actual, nunca negativo.
const segundosRestantes = (expiraEn, ahora) =>
  Math.max(Math.ceil((new Date(expiraEn) - ahora) / 1000), 0);

const dosDigitos = (n) => String(n).padStart(2, '0');

// Temporizador de la reserva. Solo aparece si el carrito tiene butacas.
// Es solo visual: el modal de vencimiento lo dispara useEdicionCarrito.
const AvisoReservaButacas = ({ carrito, items }) => {
  const expiraEn = carrito.expiraEn;
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  if (!items.some((item) => item.tipo === 'BUTACA') || !expiraEn) return null;

  const segundos = segundosRestantes(expiraEn, ahora);
  const porVencer = segundos < 60;

  return (
    <div className="rounded-xl border border-solid border-white/10 bg-white/5 px-4 py-3 text-center">
      <p className="m-0 text-sm text-gray-300">Tiempo para completar tu compra</p>
      <p
        role="timer"
        aria-live="off"
        className={`m-0 text-3xl font-bold tabular-nums [font-family:var(--titulos)] ${
          porVencer ? 'text-[var(--error)]' : 'text-[var(--dorado-texto)]'
        }`}
      >
        {dosDigitos(Math.floor(segundos / 60))}:{dosDigitos(segundos % 60)}
      </p>
      <p aria-live="polite" className="m-0 text-sm text-[var(--error)]">
        {porVencer && '¡Apurate! Tus butacas están por liberarse'}
      </p>
    </div>
  );
};

export default AvisoReservaButacas;
