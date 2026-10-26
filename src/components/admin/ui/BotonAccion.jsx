
const BotonAccion = ({ children, onClick, variante = 'primario', type = 'button' }) => {
  
  return (
    <button type={type} className={`btn-admin btn-${variante}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default BotonAccion;