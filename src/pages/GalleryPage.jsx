import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { COLORS, getCrewStrength } from '../constants';

function colorHex(name) {
  return COLORS.find(c => c.name === name)?.hex ?? '#888';
}

function speedScore(s) {
  return { '0.5x': 1, '1x': 2, '1.5x': 3, '2x': 4, '2.5x': 5 }[s] ?? 0;
}

export default function GalleryPage() {
  const [crewmates, setCrewmates] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCrew() {
    setLoading(true);
    const { data } = await supabase
      .from('crewmates')
      .select('*')
      .order('created_at', { ascending: false });
    setCrewmates(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchCrew(); }, []);

  // --- Stats ---
  const total = crewmates.length;
  const imposters = crewmates.filter(c => c.role === 'Imposter').length;
  const colorCounts = crewmates.reduce((acc, c) => {
    acc[c.color] = (acc[c.color] ?? 0) + 1;
    return acc;
  }, {});
  const topColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
  const strength = getCrewStrength(crewmates);

  const suspectPct = total > 0 ? Math.round((imposters / total) * 100) : 0;

  if (loading) {
    return <div className="loading-center"><span className="spinner" /></div>;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Crew Gallery</h1>
          <p className="page-subtitle">{total} crewmate{total !== 1 ? 's' : ''} recruited so far.</p>
        </div>
        <Link to="/create" className="btn btn-primary">＋ New Crewmate</Link>
      </div>

      {/* Stats panel (stretch feature) */}
      {total > 0 && (
        <div className="stats-panel">
          <div className="stats-panel-title">🛸 Mission Stats</div>
          <div className="stats-grid">
            <div className="stats-item">
              <div className="stats-item-label">Total Crew</div>
              <div className="stats-item-value">{total}</div>
            </div>
            <div className="stats-item">
              <div className="stats-item-label">Imposters</div>
              <div className="stats-item-value">{imposters}</div>
            </div>
            <div className="stats-item">
              <div className="stats-item-label">Suspicion %</div>
              <div className="stats-item-value">{suspectPct}%</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: suspectPct + '%' }} />
              </div>
            </div>
            <div className="stats-item">
              <div className="stats-item-label">Crew Speed Index</div>
              <div className="stats-item-value">{strength}%</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: strength + '%' }} />
              </div>
            </div>
            {topColor && (
              <div className="stats-item">
                <div className="stats-item-label">Most Popular Color</div>
                <div className="stats-item-value" style={{ color: colorHex(topColor[0]) }}>
                  {topColor[0]}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {total === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👾</span>
          <div className="empty-state-title">No crewmates yet!</div>
          <p style={{ marginBottom: '1.5rem' }}>Your crew is empty. Add someone to get started.</p>
          <Link to="/create" className="btn btn-primary">Add First Crewmate</Link>
        </div>
      ) : (
        <div className="gallery-grid">
          {crewmates.map(c => (
            <CrewmateCard key={c.id} crewmate={c} onDeleted={fetchCrew} />
          ))}
        </div>
      )}
    </div>
  );
}

function CrewmateCard({ crewmate, onDeleted }) {
  const hex = colorHex(crewmate.color);
  const score = speedScore(crewmate.speed);
  const isImposter = crewmate.role === 'Imposter';

  return (
    <div className="crewmate-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <Link
        to={`/crewmate/${crewmate.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div
          className="crewmate-card-avatar"
          style={{ background: `linear-gradient(135deg, ${hex}33 0%, ${hex}11 100%)` }}
        >
          <span style={{ filter: 'drop-shadow(0 2px 8px ' + hex + '88)' }}>
            {isImposter ? '🔪' : '👨‍🚀'}
          </span>
          {isImposter && (
            <span style={{
              position: 'absolute', top: 8, right: 10,
              background: 'rgba(233,69,96,0.9)', color: '#fff',
              fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
              borderRadius: '10px',
            }}>IMPOSTER</span>
          )}
        </div>
        <div className="crewmate-card-body">
          <div className="crewmate-card-name">{crewmate.name}</div>
          <div className="crewmate-card-attrs">
            <span className="badge" style={{ borderColor: hex + '88', color: hex }}>{crewmate.color}</span>
            <span className="badge">{crewmate.role}</span>
            <span className="badge">{crewmate.speed}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: (score / 5 * 100) + '%' }} />
          </div>
        </div>
      </Link>
      <div className="crewmate-card-actions">
        <Link to={`/edit/${crewmate.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
      </div>
    </div>
  );
}
