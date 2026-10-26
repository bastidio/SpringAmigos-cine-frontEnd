import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './admin.css';

const AdminLayout = ({ token, onLogout, onIrAEntradas }) => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      
      <div className="admin-main">
        <AdminHeader token={token} onLogout={onLogout} onIrAEntradas={onIrAEntradas} />
        
        {}
        <div className="admin-content">
          <Outlet context={{ token }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;