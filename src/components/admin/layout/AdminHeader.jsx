import { Link } from 'react-router-dom';

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="admin-header">
      <span className="admin-header__titulo">Panel de administración</span>

      <div className="admin-header__acciones">
        {/* Vuelve a la parte publica sin cerrar la sesion de admin. */}
        <Link to="/" className="admin-header__btn-cartelera">
          ← Volver a la cartelera
        </Link>
        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
