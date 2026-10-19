import { Link } from 'react-router-dom';

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="admin-header">
      {/* Vuelve a la parte publica sin cerrar la sesion de admin. */}
      <Link to="/" className="admin-header__btn-cartelera">
        ← Volver a la cartelera
      </Link>
      <button onClick={onLogout}>
        Cerrar Sesión
      </button>
    </header>
  );
};

export default AdminHeader;
