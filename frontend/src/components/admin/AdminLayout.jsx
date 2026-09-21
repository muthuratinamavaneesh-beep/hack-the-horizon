import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { path: '/admin/dashboard',     label: 'Dashboard',     icon: '▦' },
  { path: '/admin/settings',      label: 'Settings',      icon: '⚙' },
  { path: '/admin/schedule',      label: 'Schedule',      icon: '🗓' },
  { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/admin');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#03040D', fontFamily: 'Inter,sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(6,8,24,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{
          padding: '1.5rem 1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            fontFamily: 'Orbitron,monospace',
            fontWeight: 900,
            fontSize: '1.1rem',
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg,#A855F7,#06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '3px',
          }}>HTH 2.0</div>
          <div style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: '#334155',
            textTransform: 'uppercase',
          }}>CONTROL CENTER</div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.02em',
                transition: 'all 0.15s',
                background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: isActive ? '#C084FC' : '#64748B',
                border: isActive ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
              })}
            >
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{
          padding: '1rem 0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0.65rem 1rem', borderRadius: '10px',
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
              color: '#475569',
              transition: 'all 0.15s',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>↗</span> View Portal
          </a>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '0.65rem 1rem', borderRadius: '10px',
              border: '1px solid transparent',
              background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              color: '#EF4444',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <span>⎋</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
