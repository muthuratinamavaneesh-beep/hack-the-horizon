import React, { useState, useEffect } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { getServerTime, formatCountdown } from '../utils/time';

const MainCountdown = () => {
  const { settings, getUpcomingAndCurrentEvent } = useHackathon();
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(id); }, []);

  if (!settings) return null;

  const now   = getServerTime().getTime();
  const start = new Date(settings.startDateTime).getTime();
  const end   = new Date(settings.endDateTime).getTime();

  let phase = now < start ? 'before' : now <= end ? 'live' : 'after';
  let cd = phase !== 'after' ? formatCountdown(phase === 'before' ? settings.startDateTime : settings.endDateTime) : null;

  const { currentEvent, nextEvent } = getUpcomingAndCurrentEvent(now);
  const focusEvent = currentEvent || nextEvent;
  const isCurrent  = !!currentEvent;

  /* border glow colour */
  const glowColor = phase === 'live' ? 'rgba(236,72,153,0.45)' : 'rgba(124,58,237,0.45)';
  const accentColor = phase === 'live' ? '#EC4899' : '#A855F7';

  return (
    <div style={{
      borderRadius: '20px',
      border: `1px solid ${glowColor}`,
      background: 'rgba(6,8,24,0.75)',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 0 40px ${glowColor}, 0 25px 60px rgba(0,0,0,0.5)`,
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Top accent bar */}
      <div style={{
        height: '3px',
        background: phase === 'live'
          ? 'linear-gradient(90deg, #EC4899, #A855F7, transparent)'
          : 'linear-gradient(90deg, #7C3AED, #06B6D4, transparent)',
      }} />

      <div style={{ padding: '2rem 2.5rem' }}>
        {/* Status label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '1.5rem',
        }}>
          {phase === 'live' && (
            <span style={{
              width: '9px', height: '9px', borderRadius: '50%', background: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
              display: 'inline-block', animation: 'pulsate 2s ease-out infinite',
            }} />
          )}
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontWeight: 700,
            fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: accentColor,
          }}>
            {phase === 'before' ? 'HACKATHON STARTS IN' : phase === 'live' ? 'HACKATHON IS LIVE' : 'HACKATHON COMPLETED'}
          </span>
        </div>

        {/* Countdown digits */}
        {cd && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            gap: '0.75rem', marginBottom: '0.5rem',
          }}>
            {cd.days !== '00' && <><DigitBlock v={cd.days} label="DAYS" /><Sep /></>}
            <DigitBlock v={cd.hours}   label="HOURS"   />
            <Sep />
            <DigitBlock v={cd.minutes} label="MINUTES" />
            <Sep />
            <DigitBlock v={cd.seconds} label="SECONDS" />
          </div>
        )}

        {phase === 'after' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <p style={{ fontFamily: 'Orbitron,monospace', fontSize: '1.5rem', fontWeight: 900, color: '#A855F7' }}>HACK COMPLETED!</p>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />

        {/* Next event card */}
        {focusEvent ? (
          <div style={{
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            position: 'relative',
            background: 'rgba(0,0,0,0.5)',
          }}>
            {/* Background landscape */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: "url('/event_bg.jpg')",
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: 0.3,
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 100%)',
            }} />

            <div style={{
              position: 'relative', padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1.5rem',
            }}>
              {/* Left info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: isCurrent ? '#EC4899' : '#06B6D4',
                  marginBottom: '6px',
                }}>
                  {isCurrent ? '▶ LIVE NOW' : '⏭ NEXT EVENT'}
                </p>
                <h3 style={{
                  fontFamily: 'Orbitron,monospace', fontWeight: 700,
                  fontSize: '1.1rem', color: '#fff', margin: '0 0 8px',
                  letterSpacing: '0.03em',
                }}>
                  {focusEvent.title}
                </h3>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94A3B8', fontFamily: 'JetBrains Mono,monospace' }}>
                    📅 {new Date(focusEvent.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94A3B8', fontFamily: 'JetBrains Mono,monospace' }}>
                    🕒 {new Date(focusEvent.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' – '}
                    {new Date(focusEvent.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {focusEvent.description && (
                  <p style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
                    {focusEvent.description}
                  </p>
                )}
              </div>

              {/* Right countdown */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {isCurrent ? 'ENDS IN' : 'STARTS IN'}
                </p>
                <MiniCountdown targetDate={isCurrent ? focusEvent.endDateTime : focusEvent.startDateTime} />
              </div>

              {/* Chevron */}
              <div style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>›</div>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.15em' }}>
            NO UPCOMING EVENTS
          </p>
        )}
      </div>
    </div>
  );
};

const DigitBlock = ({ v, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
    <span style={{
      fontFamily: 'Orbitron,monospace', fontWeight: 900,
      fontSize: 'clamp(3rem,7vw,5rem)', lineHeight: 1,
      color: '#fff', textShadow: '0 0 40px rgba(168,85,247,0.5)',
      letterSpacing: '-0.02em',
    }}>{v}</span>
    <span style={{
      fontFamily: 'JetBrains Mono,monospace', fontWeight: 700,
      fontSize: '9px', letterSpacing: '0.18em', color: '#64748B', textTransform: 'uppercase',
    }}>{label}</span>
  </div>
);

const Sep = () => (
  <span style={{
    fontFamily: 'Orbitron,monospace', fontWeight: 900,
    fontSize: 'clamp(2rem,5vw,4rem)', color: 'rgba(124,58,237,0.5)',
    lineHeight: 1, marginTop: '4px', alignSelf: 'flex-start',
  }}>:</span>
);

const MiniCountdown = ({ targetDate }) => {
  const [cd, setCd] = useState(formatCountdown(targetDate));
  useEffect(() => {
    const id = setInterval(() => setCd(formatCountdown(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <div>
      <div style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em' }}>
        {cd.hours} : {cd.minutes} : {cd.seconds}
      </div>
      <div style={{ display: 'flex', gap: '8px', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace', color: '#475569', marginTop: '4px', justifyContent: 'space-between' }}>
        <span>HOURS</span><span>MINUTES</span><span>SECONDS</span>
      </div>
    </div>
  );
};

export default MainCountdown;
