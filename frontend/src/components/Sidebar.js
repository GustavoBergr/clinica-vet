import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/tutores', icon: '👤', label: 'Tutores' },
  { to: '/animais', icon: '🐾', label: 'Animais' },
  { to: '/consultas', icon: '📋', label: 'Consultas' },
  { to: '/sobre', icon: 'ℹ️', label: 'Sobre o Sistema' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Vet<span>Care</span></h1>
        <p>Clínica Veterinária</p>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="student-label">Desenvolvido por</div>
        <div className="student-name">Gustavo Berg Ribeiro</div>
      </div>
    </aside>
  );
}
