import { useState } from 'react';

const claseLabel =
  'mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[var(--texto-suave)]';
const claseInput =
  'box-border w-full rounded-lg border border-[var(--borde)] bg-[var(--elevado)] px-3.5 py-3 text-sm text-[var(--texto)] outline-none [font-family:inherit] focus:border-[var(--morado)] read-only:cursor-default read-only:focus:border-[var(--borde)]';

// Formulario de datos personales. Arranca con lo que viene por props y avisa
// al padre (onGuardar) cuando se envia. Si el padre no pasa onGuardar, queda
// de solo lectura.
function PersonalInfoForm({ nombreUsuario, email, onGuardar }) {
  const [datos, setDatos] = useState({ nombreUsuario, email });
  const [mensaje, setMensaje] = useState(null);
  const editable = typeof onGuardar === 'function';

  const handleChange = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();
    if (!editable) return;
    setMensaje(onGuardar(datos));
  };

  return (
    <form
      className="flex flex-col gap-5 rounded-xl border border-[var(--borde)] bg-[var(--superficie)] p-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-bold [font-family:var(--titulos)]">Datos personales</h2>

      <label>
        <span className={claseLabel}>Nombre de usuario</span>
        <input
          name="nombreUsuario"
          value={datos.nombreUsuario}
          onChange={handleChange}
          className={claseInput}
          readOnly={!editable}
          required
        />
      </label>

      <label>
        <span className={claseLabel}>Email</span>
        <input
          type="email"
          name="email"
          value={datos.email}
          onChange={handleChange}
          className={claseInput}
          readOnly={!editable}
          required
        />
      </label>

      <div className="flex flex-col gap-3">
        <div>
          <button type="submit" className="boton boton--primario" disabled={!editable}>
            Guardar cambios
          </button>
        </div>
        {!editable && (
          <p className="text-xs text-[var(--texto-suave)]">
            La edición del perfil todavía no está disponible.
          </p>
        )}
        {mensaje && <p className="text-sm text-[var(--texto-suave)]">{mensaje}</p>}
      </div>
    </form>
  );
}

export default PersonalInfoForm;
