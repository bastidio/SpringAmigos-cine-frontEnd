import PerfilMenu from '../components/perfil/PerfilMenu';




const PerfilView = ({ onLogout, onIrAEntradas }) => {
  return <PerfilMenu onLogout={onLogout} onIrAEntradas={onIrAEntradas} />;
};

export default PerfilView;
