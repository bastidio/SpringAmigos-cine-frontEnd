
const BotonAccion = ({ children, onClick, variante = 'primario', type = 'button' }) => {
  // variante puede ser 'primario' (fondo relleno), 'secundario' (solo borde) o 'texto'
  return (
    <button type={type} className={`btn-admin btn-${variante}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default BotonAccion;