import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { getEventStatus, formatTimeRange, formatDayLabel } from '../utils/time';

const SidebarSchedule = () => {
  const { events } = useHackathon();

  // Group by date label
  const grouped = {};
  for (const ev of events) {
    if (!ev.visible) continue;
    const label = formatDayLabel(ev.startDateTime);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(ev);
  }
  const dateKeys = Object.keys(grouped);
  const [activeDate, setActiveDate] = useState(0);

  const visibleEvents = dateKeys.length > 0 ? (grouped[dateKeys[activeDate]] || []) : [];

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'rgba(4, 6, 20, 0.25)', // more translucent
      backdropFilter: 'blur(30px)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem 0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{
            fontFamily: 'Orbitron,monospace', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', color: '#F1F5F9', textTransform: 'uppercase',
          }}>
            HACKATHON SCHEDULE
          </span>
        </div>
      </div>

      {/* Date tabs */}
      {dateKeys.length > 0 && (
        <div style={{
          display: 'flex', gap: '0', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {dateKeys.map((dk, i) => (
            <button
              key={dk}
              onClick={() => setActiveDate(i)}
              style={{
                flex: 1, padding: '0.6rem 0', border: 'none', cursor: 'pointer',
                fontFamily: 'Orbitron,monospace', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: activeDate === i ? '#7C3AED' : 'transparent',
                color: activeDate === i ? '#fff' : '#64748B',
                borderBottom: activeDate === i ? '2px solid #A855F7' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {dk}
            </button>
          ))}
        </div>
      )}

      {/* Event list — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
        {visibleEvents.length === 0 && (
          <p style={{
            textAlign: 'center', padding: '2rem',
            fontFamily: 'JetBrains Mono,monospace', fontSize: '11px',
            color: '#334155', letterSpacing: '0.1em',
          }}>
            NO EVENTS SCHEDULED
          </p>
        )}

        {visibleEvents.map((ev, idx) => {
          const status = getEventStatus(ev);
          const isLive = status === 'LIVE';
          const isDone = status === 'COMPLETED';

          const dotBg    = isLive ? '#EC4899' : isDone ? '#10B981' : '#06B6D4';
          const dotGlow  = isLive ? '0 0 8px #EC4899' : isDone ? 'none' : '0 0 6px #06B6D4';

          return (
            <div key={ev.id} style={{ display: 'flex', gap: '0', padding: '0 1.25rem 0 1rem', marginBottom: '4px' }}>
              {/* Timeline column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: dotBg, boxShadow: dotGlow, flexShrink: 0,
                  marginTop: '4px', border: isDone ? `2px solid ${dotBg}` : 'none',
                  opacity: isDone ? 0.7 : 1,
                }} />
                {idx < visibleEvents.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.06)', minHeight: '40px' }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1, paddingLeft: '10px', paddingBottom: '1rem',
              }}>
                {/* Time */}
                <p style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', fontWeight: 600,
                  color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '4px',
                }}>
                  {formatTimeRange(ev.startDateTime, ev.endDateTime)}
                </p>

                {/* Title + badge row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontFamily: 'Inter,sans-serif', fontWeight: 800,
                      fontSize: '1.05rem', color: isLive ? '#fff' : isDone ? '#94A3B8' : '#F1F5F9',
                      margin: '0 0 4px', lineHeight: 1.3, letterSpacing: '0.02em'
                    }}>
                      {ev.title}
                    </h4>
                    {ev.description && (
                      <p style={{
                        fontSize: '11px', color: '#475569', lineHeight: 1.4,
                        margin: 0, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {ev.description}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {isLive && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '99px',
                        border: '1px solid #EC4899', background: 'rgba(236,72,153,0.12)',
                        color: '#EC4899', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                        fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        ● LIVE NOW
                      </span>
                    )}
                    {isDone && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '99px',
                        border: '1px solid #10B981', background: 'rgba(16,185,129,0.12)',
                        color: '#10B981', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                        fontWeight: 700, letterSpacing: '0.1em',
                      }}>
                        ✓ COMPLETED
                      </span>
                    )}
                    {!isLive && !isDone && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '99px',
                        border: '1px solid #06B6D4', background: 'rgba(6,182,212,0.12)',
                        color: '#06B6D4', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
                        fontWeight: 700, letterSpacing: '0.1em',
                      }}>
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarSchedule;
