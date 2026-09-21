import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { API_URL } from '../../utils/time';

const QUICK = [
  { label: '⚡ Starting Soon',       title: 'Starting Soon',       message: 'The hackathon begins in 30 minutes. Get ready!', type: 'Important' },
  { label: '🚀 Hackathon Live!',     title: 'Hackathon is LIVE',   message: 'Code Today. Create Tomorrow. The hackathon has officially begun!', type: 'Important' },
  { label: '📋 Review in 30 min',   title: 'Project Review Soon', message: 'Project Review starts in 30 minutes. Teams please be ready.', type: 'Normal' },
  { label: '📤 Submissions Open',   title: 'Submissions Open',    message: 'The final submission portal is now open. Submit your projects!', type: 'Important' },
  { label: '⏰ Submissions Closing', title: 'Closing Soon',        message: 'Final submission closes in 1 hour. Do not wait!', type: 'Emergency' },
];

const DEFAULT = { title: '', message: '', type: 'Normal', published: true };

const inp = { width: '100%', padding: '0.7rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F1F5F9', fontFamily: 'Inter,sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const lbl = { fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '6px' };

const typeColor = t => t === 'Emergency' ? '#EC4899' : t === 'Important' ? '#06B6D4' : '#A855F7';

export default function AdminAnnouncements() {
  const { announcements } = useHackathon();
  const [all, setAll] = useState([]);
  const [form, setForm] = useState(DEFAULT);
  const [posting, setPosting] = useState(false);

  const token = () => localStorage.getItem('adminToken');

  const fetchAll = async () => {
    const res = await fetch(`${API_URL}/announcements/all`, { headers: { Authorization: `Bearer ${token()}` } });
    if (res.ok) setAll(await res.json());
  };

  useEffect(() => { fetchAll(); }, [announcements]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    await fetch(`${API_URL}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(form) });
    setForm(DEFAULT); setPosting(false);
  };

  const doDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <h1 style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '0.1em', background: 'linear-gradient(135deg,#A855F7,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 6px' }}>
        ANNOUNCEMENTS
      </h1>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#334155', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
        BROADCAST TO ALL PARTICIPANTS IN REAL-TIME
      </p>

      {/* Quick buttons */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem' }}>QUICK ANNOUNCE</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {QUICK.map(q => (
            <button
              key={q.label}
              onClick={() => setForm({ title: q.title, message: q.message, type: q.type, published: true })}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#94A3B8', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '0.8rem',
                transition: 'all 0.15s',
              }}
            >{q.label}</button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{ background: 'rgba(8,12,32,0.85)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '18px', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: '0 0 30px rgba(124,58,237,0.08)' }}>
        <p style={{ fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.12em', color: '#C084FC', marginBottom: '1.5rem' }}>COMPOSE ANNOUNCEMENT</p>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Title</label>
            <input style={inp} type="text" name="title" value={form.title} onChange={onChange} required placeholder="Announcement headline" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Message</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: '80px' }} name="message" value={form.message} onChange={onChange} required placeholder="Full announcement text..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div>
                <label style={lbl}>Priority</label>
                <select
                  name="type" value={form.type} onChange={onChange}
                  style={{ ...inp, width: 'auto', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem' }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8', marginTop: '20px' }}>
                <input type="checkbox" name="published" checked={form.published} onChange={onChange} />
                Publish immediately
              </label>
            </div>
            <button type="submit" disabled={posting} style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', color: '#fff', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)', marginTop: '20px' }}>
              {posting ? 'POSTING...' : '📢 PUBLISH'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#334155', textTransform: 'uppercase', marginBottom: '1rem' }}>
        HISTORY ({all.length})
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {all.length === 0 && (
          <div style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(8,12,32,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: '#334155', letterSpacing: '0.12em' }}>NO ANNOUNCEMENTS YET</p>
          </div>
        )}
        {all.map(a => {
          const tc = typeColor(a.type);
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(8,12,32,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
              <div style={{ width: '3px', alignSelf: 'stretch', borderRadius: '2px', background: tc, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '99px', border: `1px solid ${tc}`, background: `${tc}18`, color: tc, fontSize: '9px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{a.type.toUpperCase()}</span>
                  {!a.published && <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '99px', border: '1px solid #FBBF24', background: '#FBBF2418', color: '#FBBF24', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>DRAFT</span>}
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#334155' }}>
                    {new Date(a.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#E2E8F0', margin: '0 0 2px' }}>{a.title}</h4>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.message}</p>
              </div>
              <button
                onClick={() => doDelete(a.id)}
                style={{ padding: '4px 12px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', cursor: 'pointer', color: '#EF4444', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: '9px', letterSpacing: '0.1em', flexShrink: 0 }}
              >DELETE</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
