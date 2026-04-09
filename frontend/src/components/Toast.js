import React, { useState, useEffect, useCallback } from 'react';

let toastFn = null;

export function toast(message, type = 'success') {
  if (toastFn) toastFn(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => { toastFn = addToast; }, [addToast]);

  const colors = {
    success: { bg: '#f0fdfa', border: '#0d9488', color: '#0f766e', icon: '✅' },
    error: { bg: '#fee2e2', border: '#ef4444', color: '#991b1b', icon: '❌' },
    info: { bg: '#eff6ff', border: '#3b82f6', color: '#1d4ed8', icon: 'ℹ️' },
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.info;
        return (
          <div key={t.id} style={{
            background: c.bg,
            border: `1.5px solid ${c.border}`,
            color: c.color,
            borderRadius: 10,
            padding: '12px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            maxWidth: 340,
            animation: 'slideUp 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>{c.icon}</span>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
