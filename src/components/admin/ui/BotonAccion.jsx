
const BotonAccion = ({ children, onClick, variante = 'primario' }) => {
  // variante puede ser 'primario' (fondo relleno), 'secundario' (solo borde) o 'texto'
  return (
    <button className={`btn-admin btn-${variante}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default BotonAccion;