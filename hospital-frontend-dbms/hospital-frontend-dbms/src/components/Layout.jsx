// src/components/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Stethoscope, 
  Calendar,
  Building,
  Pill,
  Receipt,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/staff', icon: UserCog, label: 'Staff' },
    { path: '/doctors', icon: Stethoscope, label: 'Doctors' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/departments', icon: Building, label: 'Departments' },
    { path: '/medicines', icon: Pill, label: 'Medicines' },
    { path: '/bills', icon: Receipt, label: 'Bills' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{
        width: '250px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        <div className="sidebar-header" style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ 
            color: 'var(--primary)',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            Hospital MS
          </h2>
          <button 
            onClick={onClose}
            className="close-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--text-light)'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav" style={{ padding: '20px 0' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: isActive ? 'var(--primary)' : 'var(--text-light)',
                  background: isActive ? '#dbeafe' : 'transparent',
                  borderRight: isActive ? '3px solid var(--primary)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  margin: '4px 0'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-light)';
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: '12px' }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content" style={{
        flex: 1,
        marginLeft: 0,
        transition: 'margin-left 0.3s ease'
      }}>
        <header className="header" style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="menu-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--text)'
            }}
          >
            <Menu size={24} />
          </button>
          
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--text)'
          }}>
            Hospital Management System
          </h1>
          
          <div style={{ width: '40px' }}></div> {/* Spacer for alignment */}
        </header>
        
        <main className="content" style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;