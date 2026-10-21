import { useState } from 'react';

const claseLabel =
  'mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[var(--texto-suave)]';
const claseInput =
  'box-border w-full rounded-lg border border-[var(--borde)] bg-[var(--elevado)] px-3.5 py-3 text-sm text-[var(--texto)] outline-none [font-family:inherit] focus:border-[var(--morado)] disabled:cursor-not-allowed disabled:opacity-60';

// Formulario de cambio de contrasena. Valida lo basico y le pasa las dos
// contrasenas al padre (onCambiarPassword). Si el padre no lo pasa, el
// formulario queda deshabilitado.
function SecurityForm({ onCambiarPassword }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const editable = typeof onCambiarPassword === 'function';

  const handleSubmit = (evento) => {
    evento.preventDefault();
    if (!editable) return;
    setMensaje(null);
    setError(null);

    if (nueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (nueva === actual) {
      setError('La nueva contraseña tiene que ser distinta de la actual.');
      return;
    }

    setMensaje(onCambiarPassword({ actual, nueva }));
    setActual('');
    setNueva('');
  };

  return (
    <form
      className="flex flex-col gap-5 rounded-xl border border-[var(--borde)] bg-[var(--superficie)] p-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-bold [font-family:var(--titulos)]">Contraseña</h2>

      <label>
        <span className={claseLabel}>Contraseña actual</span>
        <input
          type="password"
          value={actual}
          onChange={(evento) => setActual(evento.target.value)}
          className={claseInput}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={!editable}
          required
        />
      </label>

      <label>
        <span className={claseLabel}>Nueva contraseña</span>
        <input
          type="password"
          value={nueva}
          onChange={(evento) => setNueva(evento.target.value)}
          className={claseInput}
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={!editable}
          required
        />
      </label>

      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
      {!editable && (
        <p className="text-xs text-[var(--texto-suave)]">
          El cambio de contraseña todavía no está disponible.
        </p>
      )}
      {mensaje && <p className="text-sm text-[var(--texto-suave)]">{mensaje}</p>}

      <div>
        <button type="submit" className="boton boton--secundario" disabled={!editable}>
          Cambiar contraseña
        </button>
      </div>
    </form>
  );
}

export default SecurityForm;
