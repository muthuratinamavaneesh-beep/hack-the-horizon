import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import { getEventStatus } from '../utils/time';

const Timeline = () => {
  const { events } = useHackathon();

  if (!events || events.length === 0) {
    return <p className="text-center text-[var(--color-text-muted)]">No schedule available yet.</p>;
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateStr = new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }).toUpperCase();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(event);
    return acc;
  }, {});

  return (
    <div className="relative border-l-2 border-[var(--border-subtle)] ml-4 md:ml-8 pl-8 pb-12">
      {Object.entries(groupedEvents).map(([date, dateEvents], groupIndex) => (
        <div key={date} className="mb-12">
          {/* Date Header */}
          <div className="relative -ml-12 mb-8 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)] flex items-center justify-center shadow-[0_0_10px_var(--color-primary-glow)]">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {date}
            </h3>
          </div>

          {/* Events for Date */}
          <div className="flex flex-col gap-6">
            {dateEvents.map((event, index) => {
              const status = getEventStatus(event);
              
              let statusClasses = '';
              let dotClass = '';
              
              if (status === 'LIVE NOW') {
                statusClasses = 'border-red-500/50 bg-red-900/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]';
                dotClass = 'status-dot live';
              } else if (status === 'COMPLETED') {
                statusClasses = 'opacity-60 grayscale-[0.5]';
                dotClass = 'status-dot completed';
              } else if (status === 'STARTING SOON') {
                statusClasses = 'border-[var(--color-secondary)]/50 bg-[var(--color-secondary)]/10 shadow-[0_0_15px_var(--color-secondary-glow)]';
                dotClass = 'status-dot upcoming';
              } else {
                statusClasses = 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--color-primary)]/40';
                dotClass = 'status-dot upcoming';
              }

              return (
                <div key={event.id} className={`glass-panel p-6 relative transition-all duration-300 ${statusClasses}`}>
                  {/* Timeline connector dot */}
                  <div className="absolute w-4 h-4 rounded-full bg-[var(--color-text-muted)] border-2 border-[var(--bg-dark)] -left-[2.75rem] top-8"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-[var(--color-secondary)] font-bold">
                          {new Date(event.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider ${
                          status === 'LIVE NOW' ? 'bg-red-500/20 text-red-400' :
                          status === 'COMPLETED' ? 'bg-gray-500/20 text-gray-400' :
                          status === 'STARTING SOON' ? 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]' :
                          'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-white">{event.title}</h4>
                      {event.description && <p className="text-[var(--color-text-muted)] text-sm mb-2">{event.description}</p>}
                      {event.location && (
                        <p className="text-xs text-[var(--color-text-muted)] font-mono flex items-center gap-1">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
