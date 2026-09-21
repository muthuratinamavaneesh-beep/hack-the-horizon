import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';

const LiveAnnouncement = () => {
  const { announcements } = useHackathon();
  const [dismissedId, setDismissedId] = useState(null);

  const active = announcements.find(a => a.id !== dismissedId);
  if (!active) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '1rem',
      padding: '0.6rem 1.25rem',
      borderRadius: '99px',
      border: '1px solid rgba(168,85,247,0.6)',
      background: 'rgba(168,85,247,0.08)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 20px rgba(168,85,247,0.15)',
      position: 'relative',
    }}>
      {/* Icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 6px #A855F7)' }}>
        <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>

      <span style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.2em', color: '#A855F7', textTransform: 'uppercase', flexShrink: 0,
      }}>LIVE UPDATE</span>

      <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />

      <p style={{ fontSize: '12px', color: '#CBD5E1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {active.title && <strong style={{ color: '#fff', marginRight: '4px' }}>{active.title}:</strong>}
        {active.message}
      </p>

      <button
        onClick={() => setDismissedId(active.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#475569', padding: '2px', flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

export default LiveAnnouncement;
