import PerfilDetalle from '../components/perfil/PerfilDetalle';

// Vista "Mi Perfil" (URL "/perfil"). Solo renderiza: la logica esta en
// PerfilDetalle. Las props que le pasa App las reenvia tal cual.
const PerfilView = ({ token, onLogout, onIrAEntradas }) => {
  return (
    <section className="pagina">
      <PerfilDetalle token={token} onLogout={onLogout} onIrAEntradas={onIrAEntradas} />
    </section>
  );
};

export default PerfilView;
