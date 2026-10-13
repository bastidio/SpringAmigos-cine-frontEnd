import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  // Función para marcar el link activo
  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <aside className="admin-sidebar">
      <h2>Lumiere Cine</h2>
      <nav>
        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
        <Link to="/admin/peliculas" className={isActive('/peliculas')}>Películas</Link>
        <Link to="/admin/funciones" className={isActive('/funciones')}>Funciones</Link>
        <Link to="/admin/salas" className={isActive('/salas')}>Salas</Link>
        <Link to="/admin/kiosco" className={isActive('/kiosco')}>Kiosco</Link>
        <Link to="/admin/ordenes" className={isActive('/ordenes')}>Órdenes</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;