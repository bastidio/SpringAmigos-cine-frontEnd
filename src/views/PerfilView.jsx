import PerfilMenu from '../components/perfil/PerfilMenu';

// "Mi Perfil": ya no es una pagina aparte, es el menu desplegable del icono
// del nav. Solo renderiza: la logica esta en PerfilMenu y PerfilDetalle. Las
// props que le pasa App las reenvia tal cual.
const PerfilView = ({ token, onLogout, onIrAEntradas }) => {
  return <PerfilMenu token={token} onLogout={onLogout} onIrAEntradas={onIrAEntradas} />;
};

export default PerfilView;
