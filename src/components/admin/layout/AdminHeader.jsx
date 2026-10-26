import { Link } from 'react-router-dom';
import PerfilView from '../../../views/PerfilView';

const AdminHeader = ({ token, onLogout, onIrAEntradas }) => {
  return (
    <header className="admin-header">
      <span className="admin-header__titulo">Panel de administración</span>

      <div className="admin-header__acciones">
        {}
        <Link to="/" className="admin-header__btn-cartelera">
          ← Volver a la cartelera
        </Link>
        <PerfilView token={token} onLogout={onLogout} onIrAEntradas={onIrAEntradas} />
      </div>
    </header>
  );
};

export default AdminHeader;
