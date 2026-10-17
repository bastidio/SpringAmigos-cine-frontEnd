const AdminHeader = ({ onLogout }) => {
  return (
    <header className="admin-header">
      <button onClick={onLogout}>
        Cerrar Sesión
      </button>
    </header>
  );
};

export default AdminHeader;