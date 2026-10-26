import Avatar from './Avatar';





const PerfilAvatarBoton = ({ abierto, usuario, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={abierto ? 'Cerrar mi perfil' : 'Abrir mi perfil'}
      aria-expanded={abierto}
      aria-haspopup="dialog"
      aria-controls="menu-perfil"
      title="Mi Perfil"
      className={`flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-solid bg-transparent p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--morado)] ${
        abierto
          ? 'border-[var(--morado)] bg-violet-500/15 text-[var(--morado)]'
          : 'border-white/15 text-[var(--texto-suave)] hover:bg-violet-500/10 hover:text-[var(--texto)]'
      }`}
    >
      {usuario !== null ? (
        
        <Avatar fotoPerfil={usuario.fotoPerfil} nombre={usuario.nombre} tamano={32} />
      ) : (
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )}
    </button>
  );
};

export default PerfilAvatarBoton;
