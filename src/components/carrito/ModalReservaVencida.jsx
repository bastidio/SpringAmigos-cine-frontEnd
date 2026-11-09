import { useState } from 'react';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';

const claseBoton =
  'cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--morado-texto)]';

// Se terminó el tiempo de reserva: modal obligatorio (no se cierra con Escape ni haciendo clic
// afuera). Lo dispara useEdicionCarrito a traves del contexto y se muestra una sola vez, en App,
// fuera del nav (el backdrop-filter del nav rompe el "fixed" de los hijos).
const ModalReservaVencida = ({ vencimiento, token, onNavegar, onCerrar }) => {
  const { vaciarCarritoLocal } = useCarrito();
  const [ocupado, setOcupado] = useState(false);

  if (vencimiento === null) return null;

  const hayFuncion = vencimiento.puedeReelegir && vencimiento.funcionId !== null;

  // Vacia el carrito en el backend (limpia la marca de "vencido") y despues navega.
  const elegir = async (ruta) => {
    setOcupado(true);
    try {
      await apiFetch('/api/carritos', { method: 'DELETE', token });
      vaciarCarritoLocal();
    } catch {
      // Si no se pudo vaciar, el backend lo limpia solo al pasar el vencimiento.
    }
    setOcupado(false);
    onCerrar();
    onNavegar(ruta);
  };

  // Trampa de foco: con dos botones, Tab y Shift+Tab alternan entre ellos; con uno, se queda.
  const rotarFoco = (evento) => {
    if (evento.key !== 'Tab') return;
    evento.preventDefault();
    const destino = evento.currentTarget.previousElementSibling ?? evento.currentTarget.nextElementSibling;
    if (destino !== null) destino.focus();
  };

  return (
    // onMouseDown: un clic en el fondo no le saca el foco al modal.
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(evento) => evento.preventDefault()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vencimiento-titulo"
        aria-describedby="vencimiento-mensaje"
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-solid border-[var(--dorado)]/30 bg-[var(--superficie)] p-6 text-left text-[var(--texto)] shadow-2xl shadow-black/60"
      >
        <div className="flex flex-col gap-2">
          <h2 id="vencimiento-titulo" className="m-0 text-xl font-bold text-[var(--dorado-texto)] [font-family:var(--titulos)]">
            Se terminó el tiempo de reserva
          </h2>
          <p id="vencimiento-mensaje" className="m-0 text-sm leading-relaxed text-[var(--texto-suave)]">
            Las butacas que habías elegido se liberaron y el carrito se vació, incluidos los
            productos del kiosco. Podés volver a empezar cuando quieras.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {hayFuncion && (
            <button
              type="button"
              autoFocus
              disabled={ocupado}
              onClick={() => elegir(`/funcion/${vencimiento.funcionId}/butacas`)}
              onKeyDown={rotarFoco}
              className={`${claseBoton} border-0 bg-[var(--morado)] text-[var(--texto)] hover:bg-[var(--morado-hover)]`}
            >
              Elegir butacas de nuevo
            </button>
          )}
          <button
            type="button"
            autoFocus={!hayFuncion}
            disabled={ocupado}
            onClick={() => elegir('/')}
            onKeyDown={rotarFoco}
            className={`${claseBoton} border border-solid border-[var(--borde)] bg-transparent text-[var(--texto)] hover:bg-white/5`}
          >
            Volver a la cartelera
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReservaVencida;
