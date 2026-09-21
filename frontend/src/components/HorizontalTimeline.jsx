import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import { getEventStatus, formatTimeRange, formatDayLabel } from '../utils/time';

const HorizontalTimeline = () => {
  const { events } = useHackathon();
  if (!events.length) return null;

  const visible = events.slice(0, 5);

  return (
    <div style={{ width: '100%' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span style={{ fontFamily: 'Orbitron,monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#F1F5F9' }}>
            HACKATHON TIMELINE
          </span>
        </div>
        <a href="#schedule" style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', fontWeight: 700,
          color: '#06B6D4', textDecoration: 'none', letterSpacing: '0.1em',
        }}>
          VIEW FULL SCHEDULE →
        </a>
      </div>

      {/* Cards row */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: '8px' }}>
        {visible.map((ev, i) => {
          const status   = getEventStatus(ev);
          const isLive   = status === 'LIVE';
          const isDone   = status === 'COMPLETED';
          const isNext   = !isLive && !isDone;

          const borderColor = isLive ? '#EC4899' : isDone ? '#334155' : 'rgba(255,255,255,0.12)';
          const bg = isLive
            ? 'rgba(236,72,153,0.08)'
            : isDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)';
          const glowStyle = isLive ? { boxShadow: '0 0 20px rgba(236,72,153,0.15)' } : {};

          return (
            <React.Fragment key={ev.id}>
              <div style={{
                minWidth: '200px', maxWidth: '220px', flexShrink: 0,
                borderRadius: '16px',
                border: `1px solid ${borderColor}`,
                background: bg,
                backdropFilter: 'blur(10px)',
                padding: '1rem',
                opacity: isDone ? 0.65 : 1,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                ...glowStyle,
              }}>
                {/* Top: date box + date/time */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    {/* Date box */}
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0,
                      border: `1px solid ${isLive ? '#EC4899' : 'rgba(255,255,255,0.12)'}`,
                      background: isLive ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '8px', color: '#64748B', textTransform: 'uppercase' }}>
                        {new Date(ev.startDateTime).toLocaleString('en', { month: 'short' })}
                      </span>
                      <span style={{
                        fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '0.95rem', lineHeight: 1,
                        color: isLive ? '#EC4899' : '#fff',
                      }}>
                        {new Date(ev.startDateTime).getDate()}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', color: '#64748B', lineHeight: 1.3 }}>
                        {formatDayLabel(ev.startDateTime)}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', color: '#475569', lineHeight: 1.3 }}>
                        {formatTimeRange(ev.startDateTime, ev.endDateTime)}
                      </div>
                    </div>
                  </div>

                  <h4 style={{
                    fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.8rem',
                    color: isDone ? '#64748B' : '#E2E8F0',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    margin: '0 0 6px', lineHeight: 1.3,
                  }}>
                    {ev.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {ev.description}
                  </p>
                </div>

                {/* Bottom: status badge */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {isLive && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '99px',
                      border: '1px solid #EC4899', background: 'rgba(236,72,153,0.12)',
                      color: '#EC4899', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                      fontWeight: 700, letterSpacing: '0.1em',
                    }}>
                      ● LIVE NOW
                    </span>
                  )}
                  {isDone && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '99px',
                      border: '1px solid #10B981', background: 'rgba(16,185,129,0.12)',
                      color: '#10B981', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                      fontWeight: 700,
                    }}>
                      ✓ COMPLETED
                    </span>
                  )}
                  {isNext && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '99px',
                      border: '1px solid #06B6D4', background: 'rgba(6,182,212,0.12)',
                      color: '#06B6D4', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                      fontWeight: 700,
                    }}>
                      UPCOMING
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow between cards */}
              {i < visible.length - 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#334155', padding: '0 4px', flexShrink: 0, fontSize: '1.2rem',
                }}>›</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalTimeline;
