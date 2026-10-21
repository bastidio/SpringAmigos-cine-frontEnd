// Tarjeta de arriba: avatar con la inicial, nombre, email y badges.
function ProfileHeader({ nombre, email, rol, entradasActivas }) {
  return (
    <section className="flex items-center gap-5 rounded-xl border border-[var(--borde)] bg-[var(--superficie)] p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-xl font-bold text-[var(--texto)]">
        {nombre.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold [font-family:var(--titulos)]">{nombre}</h2>
        <p className="truncate text-sm text-[var(--texto-suave)]">{email}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="etiqueta">{rol}</span>
          {entradasActivas > 0 && (
            <span className="etiqueta etiqueta--dorada">
              {entradasActivas} {entradasActivas === 1 ? 'entrada activa' : 'entradas activas'}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;
