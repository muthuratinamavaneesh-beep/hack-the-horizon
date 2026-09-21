import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import MainCountdown from '../components/MainCountdown';
import LiveAnnouncement from '../components/LiveAnnouncement';
import HorizontalTimeline from '../components/HorizontalTimeline';
import SidebarSchedule from '../components/SidebarSchedule';

/* ── Navbar ─────────────────────────────────── */
const Navbar = () => (
  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '56px',
    background: 'rgba(4,6,20,0.75)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  }}>
    {/* Logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '1.25rem',
        fontStyle: 'italic', letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg,#A855F7,#06B6D4)', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        HTH<span style={{ fontSize: '0.75rem' }}>2.0</span>
      </div>
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
      <span style={{ fontSize: '0.75rem', fontFamily: 'Orbitron,monospace', color: '#94A3B8', letterSpacing: '0.12em', fontWeight: 600 }}>
        HACK THE HORIZON 2.0
      </span>
    </div>

    {/* Center nav */}
    <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
      <a href="#" style={{
        color: '#fff', textDecoration: 'none', letterSpacing: '0.05em',
        borderBottom: '2px solid #7C3AED', paddingBottom: '2px',
      }}>Home</a>
      <a href="#schedule" style={{ color: '#94A3B8', textDecoration: 'none', letterSpacing: '0.05em' }}>Schedule</a>
      <a href="/admin" style={{ color: '#94A3B8', textDecoration: 'none', letterSpacing: '0.05em' }}>About</a>
    </div>

    {/* Right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '4px 14px', borderRadius: '99px',
        border: '1px solid #10B981', background: 'rgba(16,185,129,0.12)',
      }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#10B981', boxShadow: '0 0 8px #10B981',
          animation: 'pulsate 2s ease-out infinite', display: 'inline-block',
        }} />
        <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: '#10B981', letterSpacing: '0.15em' }}>LIVE</span>
      </div>
      <a href="/admin" style={{
        width: '34px', height: '34px', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem',
      }}>⚙</a>
    </div>
  </nav>
);

/* ── Hero Title ─────────────────────────────── */
const HeroTitle = () => (
  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    {/* Crown */}
    <div style={{ marginBottom: '0.5rem' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#crownG)" strokeWidth="1.5">
        <defs>
          <linearGradient id="crownG" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#A855F7"/><stop offset="1" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
        <path d="M2 20h20M5 20l2-8 5 4 5-4 2 8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>

    <h1 style={{
      fontFamily: 'Orbitron,monospace', fontWeight: 900,
      lineHeight: 1, margin: 0,
      fontSize: 'clamp(2.8rem, 6vw, 5rem)',
      color: '#fff', letterSpacing: '-0.02em',
      textShadow: '0 0 40px rgba(255,255,255,0.25)',
    }}>
      HACK THE
    </h1>
    <h1 style={{
      fontFamily: 'Orbitron,monospace', fontWeight: 900,
      lineHeight: 1, margin: '0.1em 0 0',
      fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
      background: 'linear-gradient(135deg, #C084FC 0%, #EC4899 40%, #06B6D4 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      letterSpacing: '-0.02em',
      filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.5))',
    }}>
      HORIZON <span style={{ fontSize: '0.55em', color: '#67E8F9', WebkitTextFillColor: '#67E8F9' }}>2.0</span>
    </h1>

    <p style={{
      fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem',
      letterSpacing: '0.35em', color: '#94A3B8',
      textTransform: 'uppercase', marginTop: '1rem', fontWeight: 600,
    }}>
      Code Today. Create Tomorrow.
    </p>
  </div>
);

/* ── Public Portal ───────────────────────────── */
const PublicPortal = () => {
  const { settings, loading } = useHackathon();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'Orbitron,monospace', fontSize: '1rem',
          background: 'linear-gradient(135deg,#A855F7,#06B6D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '0.2em', animation: 'shimmer 1.5s ease-in-out infinite',
        }}>
          SYNCING SYSTEMS...
        </span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '56px', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Main grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 0,
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        padding: '0',
      }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '2.5rem 2.5rem 2rem 3rem',
          minHeight: 0,
        }}>
          <HeroTitle />

          {/* Countdown - constrained width */}
          <div style={{ width: '100%', maxWidth: '700px' }}>
            <LiveAnnouncement />
            <MainCountdown />
          </div>

          {/* Timeline */}
          <div style={{ width: '100%', marginTop: '2rem' }} id="schedule">
            <HorizontalTimeline />
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          height: 'calc(100vh - 56px)',
          position: 'sticky',
          top: '56px',
          overflow: 'hidden',
          background: 'rgba(4,6,20,0.6)',
          backdropFilter: 'blur(20px)',
        }}>
          <SidebarSchedule />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'JetBrains Mono,monospace', fontSize: '10px',
        color: '#475569', letterSpacing: '0.15em',
      }}>
        HACK THE HORIZON 2.0 &nbsp;•&nbsp; DEPT. OF CS (AI &amp; ML) &nbsp;•&nbsp; 24–25 SEP 2026
      </div>
    </div>
  );
};

export default PublicPortal;
