import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 500 }}>
            🐾 VetCare System
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
