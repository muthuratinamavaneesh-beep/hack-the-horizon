import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { API_URL, getEventStatus, formatTimeRange, formatDayLabel } from '../../utils/time';

/* ── shared input style ── */
const inp = (extra = {}) => ({
  width: '100%', boxSizing: 'border-box',
  padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: '#F1F5F9',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  outline: 'none',
  colorScheme: 'dark',        /* makes native date picker dark */
  ...extra,
});

const lbl = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.15em', textTransform: 'uppercase',
  color: '#64748B', display: 'block', marginBottom: '6px',
};

const DEFAULT = {
  title: '', startDateTime: '', endDateTime: '',
  location: '', description: '', visible: true, important: false,
};

const statusColor = s =>
  s === 'LIVE' ? '#EC4899' : s === 'COMPLETED' ? '#10B981' : '#06B6D4';

export default function AdminSchedule() {
  const { events } = useHackathon();
  const [all,      setAll]      = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(DEFAULT);

  const token = () => localStorage.getItem('adminToken');

  const fetchAll = async () => {
    const res = await fetch(`${API_URL}/events/all`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (res.ok) setAll(await res.json());
  };

  useEffect(() => { fetchAll(); }, [events]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  /* Auto-set endDateTime date part to match startDateTime date */
  const onStartChange = e => {
    const val = e.target.value; // "YYYY-MM-DDTHH:mm"
    setForm(p => {
      let end = p.endDateTime;
      // Keep time part of end, but update date to match start
      if (end && val) {
        const timePart = end.slice(10); // "THH:mm"
        end = val.slice(0, 10) + timePart;
      }
      return { ...p, startDateTime: val, endDateTime: end };
    });
  };

  const openAdd = () => { setForm(DEFAULT); setEditId(null); setShowForm(true); };

  const openEdit = ev => {
    setForm({
      title:         ev.title,
      startDateTime: new Date(ev.startDateTime).toISOString().slice(0, 16),
      endDateTime:   new Date(ev.endDateTime).toISOString().slice(0, 16),
      location:      ev.location    || '',
      description:   ev.description || '',
      visible:       ev.visible,
      important:     ev.important,
    });
    setEditId(ev.id);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    /* derive `date` field automatically from startDateTime */
    const payload = {
      ...form,
      date: form.startDateTime ? form.startDateTime.slice(0, 10) : '',
    };
    const url    = editId ? `${API_URL}/events/${editId}` : `${API_URL}/events`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(payload),
    });
    setShowForm(false); setEditId(null); setForm(DEFAULT);
  };

  const doDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
  };

  const toggleVis = async (ev) => {
    await fetch(`${API_URL}/events/${ev.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ...ev, date: new Date(ev.startDateTime).toISOString().slice(0, 10), visible: !ev.visible }),
    });
  };

  /* ── Render ── */
  return (
    <div style={{ maxWidth: '900px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '0.1em', background: 'linear-gradient(135deg,#A855F7,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 6px' }}>
            SCHEDULE
          </h1>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#334155', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            {all.length} EVENTS CONFIGURED
          </p>
        </div>
        <button
          onClick={() => showForm ? (setShowForm(false), setEditId(null), setForm(DEFAULT)) : openAdd()}
          style={{
            padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em',
            color: '#fff',
            background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#7C3AED,#A855F7)',
            boxShadow: showForm ? 'none' : '0 4px 16px rgba(124,58,237,0.35)',
          }}
        >
          {showForm ? '✕ CANCEL' : '+ ADD EVENT'}
        </button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div style={{
          background: 'rgba(8,12,32,0.9)',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: '18px', padding: '2rem', marginBottom: '2rem',
          boxShadow: '0 0 30px rgba(124,58,237,0.12)',
        }}>
          <p style={{ fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.12em', color: '#C084FC', marginBottom: '1.75rem' }}>
            {editId ? '✏ EDIT EVENT' : '+ NEW EVENT'}
          </p>

          <form onSubmit={onSubmit}>
            {/* Event Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Event Name *</label>
              <input
                style={inp()}
                type="text" name="title" value={form.title}
                onChange={onChange} required
                placeholder="e.g. Team Setup & Registration"
              />
            </div>

            {/* Start + End side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={lbl}>Start Date & Time *</label>
                <input
                  style={inp({ fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer' })}
                  type="datetime-local"
                  name="startDateTime"
                  value={form.startDateTime}
                  onChange={onStartChange}
                  required
                />
              </div>
              <div>
                <label style={lbl}>End Date & Time *</label>
                <input
                  style={inp({ fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer' })}
                  type="datetime-local"
                  name="endDateTime"
                  value={form.endDateTime}
                  onChange={onChange}
                  min={form.startDateTime}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Location <span style={{ color: '#334155' }}>(optional)</span></label>
              <input
                style={inp()}
                type="text" name="location" value={form.location}
                onChange={onChange} placeholder="e.g. Main Auditorium"
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Description <span style={{ color: '#334155' }}>(optional)</span></label>
              <textarea
                style={inp({ resize: 'vertical', minHeight: '80px' })}
                name="description" value={form.description}
                onChange={onChange}
                placeholder="Brief description of this event..."
              />
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8', userSelect: 'none' }}>
                <input
                  type="checkbox" name="visible" checked={form.visible} onChange={onChange}
                  style={{ width: '16px', height: '16px', accentColor: '#A855F7', cursor: 'pointer' }}
                />
                Visible to participants
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#EC4899', userSelect: 'none' }}>
                <input
                  type="checkbox" name="important" checked={form.important} onChange={onChange}
                  style={{ width: '16px', height: '16px', accentColor: '#EC4899', cursor: 'pointer' }}
                />
                Mark as important
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em',
                color: '#fff', background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              }}
            >
              {editId ? '💾 SAVE CHANGES' : '✓ CREATE EVENT'}
            </button>
          </form>
        </div>
      )}

      {/* ── Event List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {all.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(8,12,32,0.5)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: '#334155', letterSpacing: '0.15em' }}>
              NO EVENTS YET — CLICK &quot;+ ADD EVENT&quot; TO GET STARTED
            </p>
          </div>
        )}

        {all.map(ev => {
          const status = getEventStatus(ev);
          const sc = statusColor(status);
          return (
            <div
              key={ev.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'rgba(8,12,32,0.75)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                opacity: ev.visible ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Colour strip */}
              <div style={{ width: '3px', alignSelf: 'stretch', borderRadius: '2px', background: sc, flexShrink: 0 }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <Pill color={sc} text={status} />
                  {!ev.visible  && <Pill color="#FBBF24" text="HIDDEN"    />}
                  {ev.important && <Pill color="#EC4899" text="IMPORTANT" />}
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#475569', marginLeft: '4px' }}>
                    {formatDayLabel(ev.startDateTime)} &nbsp;·&nbsp; {formatTimeRange(ev.startDateTime, ev.endDateTime)}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#E2E8F0', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.title}
                </h3>
                {ev.description && (
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#475569', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ev.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <ABtn onClick={() => toggleVis(ev)}   label={ev.visible ? 'HIDE' : 'SHOW'} />
                <ABtn onClick={() => openEdit(ev)}    label="EDIT"   color="#06B6D4" />
                <ABtn onClick={() => doDelete(ev.id)} label="DELETE" color="#EF4444" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── tiny helpers ── */
const Pill = ({ color, text }) => (
  <span style={{
    display: 'inline-flex', padding: '2px 8px', borderRadius: '99px',
    border: `1px solid ${color}`, background: `${color}18`,
    color, fontSize: '9px', fontFamily: 'JetBrains Mono,monospace',
    fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap',
  }}>{text}</span>
);

const ABtn = ({ onClick, label, color = '#94A3B8' }) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 12px', borderRadius: '7px',
      border: `1px solid ${color}30`, background: `${color}10`,
      cursor: 'pointer', color,
      fontFamily: 'JetBrains Mono,monospace',
      fontWeight: 700, fontSize: '9px', letterSpacing: '0.1em',
    }}
  >{label}</button>
);
