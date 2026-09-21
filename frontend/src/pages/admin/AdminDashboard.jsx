import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { getServerTime, getEventStatus } from '../../utils/time';

const card = (color = '#A855F7') => ({
  background: 'rgba(8,12,32,0.8)',
  border: `1px solid ${color}30`,
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: `0 0 20px ${color}10`,
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
});

const StatCard = ({ icon, label, value, color }) => (
  <div style={card(color)}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem',
      background: `${color}18`, border: `1px solid ${color}30`,
    }}>{icon}</div>
    <div>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '2rem', color, margin: 0, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
);

const QuickLink = ({ href, label, icon, primary }) => (
  <a
    href={href}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '0.6rem 1.25rem', borderRadius: '10px',
      textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
      fontFamily: 'Inter,sans-serif',
      background: primary ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'rgba(255,255,255,0.05)',
      border: primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
      color: '#fff',
      boxShadow: primary ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
      transition: 'opacity 0.15s',
    }}
  >
    {icon} {label}
  </a>
);

export default function AdminDashboard() {
  const { settings, events, announcements, getUpcomingAndCurrentEvent } = useHackathon();

  if (!settings) {
    return (
      <div style={{ color: '#475569', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', letterSpacing: '0.15em', animation: 'shimmer 1.5s infinite' }}>
        LOADING MISSION DATA...
      </div>
    );
  }

  const now = getServerTime().getTime();
  const { currentEvent } = getUpcomingAndCurrentEvent(now);
  const completed = events.filter(e => getEventStatus(e) === 'COMPLETED').length;
  const liveAnn   = announcements.filter(a => a.published).length;

  const hackStart = new Date(settings.startDateTime);
  const hackEnd   = new Date(settings.endDateTime);
  const isLive    = now >= hackStart.getTime() && now <= hackEnd.getTime();

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Page title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: 'Orbitron,monospace', fontWeight: 900,
          fontSize: '1.75rem', letterSpacing: '0.1em',
          background: 'linear-gradient(135deg,#A855F7,#06B6D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', margin: '0 0 6px',
        }}>DASHBOARD</h1>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#334155', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          REAL-TIME MISSION OVERVIEW
        </p>
      </div>

      {/* Status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0.9rem 1.5rem', borderRadius: '12px', marginBottom: '2rem',
        background: isLive ? 'rgba(16,185,129,0.08)' : 'rgba(124,58,237,0.08)',
        border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
      }}>
        <span style={{
          width: '9px', height: '9px', borderRadius: '50%',
          background: isLive ? '#10B981' : '#A855F7',
          boxShadow: isLive ? '0 0 8px #10B981' : '0 0 8px #A855F7',
          flexShrink: 0, display: 'inline-block',
          animation: 'pulsate 2s ease-out infinite',
        }} />
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', color: isLive ? '#10B981' : '#A855F7' }}>
          {isLive ? 'HACKATHON IS LIVE' : now < hackStart.getTime() ? 'HACKATHON HAS NOT STARTED YET' : 'HACKATHON HAS ENDED'}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#475569', marginLeft: 'auto' }}>
          {hackStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' → '}
          {hackEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon="🗓" label="Total Events"  value={events.length}     color="#A855F7" />
        <StatCard icon="✅" label="Completed"     value={completed}          color="#10B981" />
        <StatCard icon="📢" label="Live Alerts"   value={liveAnn}            color="#EC4899" />
        <StatCard icon="▶"  label="Now Live"      value={currentEvent ? '●' : '—'} color={currentEvent ? '#EC4899' : '#334155'} />
      </div>

      {/* Current event card */}
      {currentEvent && (
        <div style={{ ...card('#EC4899'), marginBottom: '2rem', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EC4899', boxShadow: '0 0 8px #EC4899', display: 'inline-block', animation: 'pulsate 2s infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#EC4899' }}>LIVE NOW</span>
          </div>
          <h2 style={{ fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '1.1rem', color: '#fff', margin: '0 0 4px' }}>{currentEvent.title}</h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: '#64748B', margin: 0 }}>
            {new Date(currentEvent.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' – '}
            {new Date(currentEvent.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      {/* Quick links */}
      <div>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#334155', textTransform: 'uppercase', marginBottom: '1rem' }}>
          QUICK ACTIONS
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <QuickLink href="/admin/settings"      label="Edit Settings"      icon="⚙" />
          <QuickLink href="/admin/schedule"      label="Manage Schedule"    icon="🗓" />
          <QuickLink href="/admin/announcements" label="Announcements"      icon="📢" />
          <QuickLink href="/" label="↗ View Portal" icon="" primary />
        </div>
      </div>
    </div>
  );
}
