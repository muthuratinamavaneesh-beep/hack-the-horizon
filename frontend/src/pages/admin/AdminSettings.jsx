import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { API_URL } from '../../utils/time';

const S = {
  page: { maxWidth: '700px' },
  h1: { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '0.1em', background: 'linear-gradient(135deg,#A855F7,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 6px' },
  sub: { fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: '#334155', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem', display: 'block' },
  card: { background: 'rgba(8,12,32,0.8)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '18px', padding: '2rem', boxShadow: '0 0 30px rgba(124,58,237,0.1)' },
  label: { fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '8px' },
  input: { width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F1F5F9', fontFamily: 'Inter,sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  group: { marginBottom: '1.25rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem' },
  success: { padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' },
  error:   { padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' },
  btn: { padding: '0.75rem 1.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.12em', color: '#fff', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' },
};

export default function AdminSettings() {
  const { settings } = useHackathon();
  const [form, setForm] = useState({ name: '', startDateTime: '', endDateTime: '', timezone: 'Asia/Kolkata', description: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || '',
        startDateTime: new Date(settings.startDateTime).toISOString().slice(0, 16),
        endDateTime:   new Date(settings.endDateTime).toISOString().slice(0, 16),
        timezone:      settings.timezone || 'Asia/Kolkata',
        description:   settings.description || '',
      });
    }
  }, [settings]);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${API_URL}/hackathon`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(form),
      });
      setMsg(res.ok ? { ok: true, text: '✓ Settings saved and broadcast live to all viewers.' } : { ok: false, text: 'Failed to save settings.' });
    } catch {
      setMsg({ ok: false, text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.page}>
      <h1 style={S.h1}>SETTINGS</h1>
      <span style={S.sub}>Changes are broadcast live via WebSocket instantly.</span>

      <div style={S.card}>
        <form onSubmit={onSubmit}>
          <div style={S.group}>
            <label style={S.label}>Hackathon Name</label>
            <input style={S.input} type="text" name="name" value={form.name} onChange={onChange} required />
          </div>

          <div style={{ ...S.grid2, ...S.group }}>
            <div>
              <label style={S.label}>Start Date & Time</label>
              <input style={{ ...S.input, fontFamily: 'JetBrains Mono,monospace', colorScheme: 'dark', cursor: 'pointer' }} type="datetime-local" name="startDateTime" value={form.startDateTime} onChange={onChange} required />
            </div>
            <div>
              <label style={S.label}>End Date & Time</label>
              <input style={{ ...S.input, fontFamily: 'JetBrains Mono,monospace', colorScheme: 'dark', cursor: 'pointer' }} type="datetime-local" name="endDateTime" value={form.endDateTime} onChange={onChange} required />
            </div>
          </div>

          <div style={S.group}>
            <label style={S.label}>Timezone</label>
            <input style={{ ...S.input, fontFamily: 'JetBrains Mono,monospace' }} type="text" name="timezone" value={form.timezone} onChange={onChange} required />
          </div>

          <div style={S.group}>
            <label style={S.label}>Tagline / Description</label>
            <input style={S.input} type="text" name="description" value={form.description} onChange={onChange} placeholder="e.g. Code Today. Create Tomorrow." />
          </div>

          {msg && <div style={msg.ok ? S.success : S.error}>{msg.text}</div>}

          <button type="submit" style={S.btn} disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE & BROADCAST'}
          </button>
        </form>
      </div>
    </div>
  );
}
