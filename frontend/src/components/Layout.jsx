import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Factory, AlertTriangle, FileText, Map, LogOut, Activity, ClipboardCheck, Smartphone, User } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Admin Map (Dashboard)', icon: <Map size={20} /> },
    { path: '/alert-detail', label: 'Alert Details', icon: <AlertTriangle size={20} /> },
    { path: '/sensor-live', label: 'Sensor Live Feed', icon: <Activity size={20} /> },
    { path: '/inspector-view', label: 'Inspector View', icon: <ClipboardCheck size={20} /> },
    { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
    { path: '/citizen', label: 'Citizen View (Mobile)', icon: <Smartphone size={20} /> },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-icon">CR</div>
          <h2>ComplianceRadar</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-details">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-role">{user?.role || 'Admin'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar glass-panel">
          <div className="topbar-search">
            <input type="text" placeholder="Search..." className="form-input" />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn"><AlertTriangle size={20} /></button>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
