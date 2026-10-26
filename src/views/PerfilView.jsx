import PerfilMenu from '../components/perfil/PerfilMenu';




const PerfilView = ({ token, onLogout, onIrAEntradas }) => {
  return <PerfilMenu token={token} onLogout={onLogout} onIrAEntradas={onIrAEntradas} />;
};

export default PerfilView;
