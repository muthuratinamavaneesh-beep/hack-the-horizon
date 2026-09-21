import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/time';

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    position: 'relative',
  },
  wrap: {
    width: '100%',
    maxWidth: '420px',
  },
  top: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  iconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    margin: '0 auto 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.2))',
    border: '1px solid rgba(124,58,237,0.5)',
  },
  h1: {
    fontFamily: 'Orbitron,monospace',
    fontWeight: 900,
    fontSize: '1.5rem',
    letterSpacing: '0.1em',
    background: 'linear-gradient(135deg,#A855F7,#06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 6px',
  },
  sub: {
    fontFamily: 'JetBrains Mono,monospace',
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: '#475569',
    textTransform: 'uppercase',
  },
  card: {
    background: 'rgba(8,12,32,0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(124,58,237,0.35)',
    borderRadius: '20px',
    padding: '2.25rem',
    boxShadow: '0 0 40px rgba(124,58,237,0.15), 0 25px 60px rgba(0,0,0,0.5)',
  },
  label: {
    display: 'block',
    fontFamily: 'JetBrains Mono,monospace',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#64748B',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#F1F5F9',
    fontFamily: 'Inter,sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  group: { marginBottom: '1.25rem' },
  error: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#F87171',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
  btn: {
    width: '100%',
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Orbitron,monospace',
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    color: '#fff',
    background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
    transition: 'all 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontFamily: 'JetBrains Mono,monospace',
    fontSize: '10px',
    color: '#334155',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.top}>
          <div style={S.iconBox}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#A855F7"/><stop offset="1" stopColor="#06B6D4"/>
                </linearGradient>
              </defs>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#sg)"/>
            </svg>
          </div>
          <h1 style={S.h1}>CONTROL CENTER</h1>
          <p style={S.sub}>Hack The Horizon 2.0 — Admin</p>
        </div>

        <div style={S.card}>
          <form onSubmit={onSubmit} autoComplete="off">
            <div style={S.group}>
              <label style={S.label}>Username</label>
              <input
                style={S.input}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
              />
            </div>
            <div style={S.group}>
              <label style={S.label}>Password</label>
              <input
                style={S.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div style={S.error}>{error}</div>}

            <button type="submit" style={S.btn} disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'ACCESS CONTROL CENTER'}
            </button>
          </form>
        </div>

        <p style={S.footer}>Secure Admin Access &nbsp;•&nbsp; HTH 2.0</p>
      </div>
    </div>
  );
}
