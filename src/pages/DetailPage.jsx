import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { COLORS, getSuspicionLevel } from '../constants';

function colorHex(name) {
  return COLORS.find(c => c.name === name)?.hex ?? '#888';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function roleEmoji(role) {
  const map = {
    Crewmate: '👨‍🚀',
    Imposter: '🔪',
    Engineer: '🔧',
    Scientist: '🧪',
    'Guardian Angel': '👼',
  };
  return map[role] ?? '👤';
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crewmate, setCrewmate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from('crewmates')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setCrewmate(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;
  if (notFound) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <div className="empty-state-title">Crewmate not found</div>
        <Link to="/gallery" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Gallery
        </Link>
      </div>
    );
  }

  const hex = colorHex(crewmate.color);
  const suspicion = getSuspicionLevel(crewmate.role, crewmate.color);
  const speedMap = { '0.5x': 'Sluggish', '1x': 'Standard', '1.5x': 'Swift', '2x': 'Turbo', '2.5x': 'Ultra' };
  const taskMap = { '0.5x': 2, '1x': 4, '1.5x': 6, '2x': 8, '2.5x': 10 };

  return (
    <div>
      <Link to="/gallery" className="back-link">← Back to Gallery</Link>

      <div className="detail-layout">
        {/* Avatar card */}
        <div>
          <div className="detail-avatar-card" style={{
            background: `linear-gradient(160deg, ${hex}22 0%, var(--bg-card) 60%)`,
            borderColor: hex + '55',
          }}>
            <span className="detail-avatar">{roleEmoji(crewmate.role)}</span>
            <div className="detail-name">{crewmate.name}</div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-accent">{crewmate.role}</span>
            </div>
            <div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: hex, margin: '0 auto 0.5rem',
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: `0 0 20px ${hex}88`,
              }}
            />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{crewmate.color}</div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Link to={`/edit/${crewmate.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              ✏️ Edit
            </Link>
          </div>
        </div>

        {/* Info card */}
        <div className="detail-info-card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Crew File
          </h2>

          <div className="info-row">
            <span className="info-key">Name</span>
            <span className="info-value">{crewmate.name}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Role</span>
            <span className="info-value">{roleEmoji(crewmate.role)} {crewmate.role}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Color</span>
            <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: hex, display: 'inline-block' }} />
              {crewmate.color}
            </span>
          </div>
          <div className="info-row">
            <span className="info-key">Speed</span>
            <span className="info-value">{crewmate.speed} — {speedMap[crewmate.speed] ?? crewmate.speed}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Tasks Cleared</span>
            <span className="info-value">{taskMap[crewmate.speed] ?? '?'} / mission</span>
          </div>
          <div className="info-row">
            <span className="info-key">Recruited</span>
            <span className="info-value" style={{ fontSize: '0.85rem' }}>{formatDate(crewmate.created_at)}</span>
          </div>

          {/* Suspicion meter (extra detail) */}
          <div className="suspicion-bar">
            <div className="suspicion-label">
              <span>Suspicion Level</span>
              <span style={{ color: suspicion > 60 ? 'var(--accent)' : 'var(--success)' }}>
                {suspicion}% {suspicion > 60 ? '🚨' : suspicion > 30 ? '⚠️' : '✅'}
              </span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 8 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: suspicion + '%',
                  background: suspicion > 60
                    ? 'linear-gradient(90deg, #ef4444, #f97316)'
                    : 'linear-gradient(90deg, #4ade80, #22d3ee)',
                }}
              />
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {suspicion > 60
                ? 'This crew member is highly suspicious. Keep an eye on them.'
                : suspicion > 30
                ? 'Moderately suspicious. Could go either way.'
                : 'Low suspicion. Probably safe.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
