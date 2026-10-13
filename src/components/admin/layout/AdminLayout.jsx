import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './admin.css';

const AdminLayout = ({ onLogout }) => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      
      <div className="admin-main">
        <AdminHeader onLogout={onLogout} />
        
        {/* Aquí renderiza la vista correspondiente (Peliculas, Kiosco, etc.) */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;