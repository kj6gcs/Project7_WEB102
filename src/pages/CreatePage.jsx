import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { COLORS, ROLES, ROLE_SPEEDS } from '../constants';

export default function CreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [role, setRole] = useState('');
  const [speed, setSpeed] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const availableSpeeds = role ? ROLE_SPEEDS[role] : ['0.5x', '1x', '1.5x', '2x', '2.5x'];

  function handleRoleChange(r) {
    setRole(r);
    // Reset speed if it's no longer available for the new role
    if (speed && !ROLE_SPEEDS[r].includes(speed)) {
      setSpeed('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter a name for your crewmate.');
    if (!color) return setError('Please select a color.');
    if (!role) return setError('Please select a role.');
    if (!speed) return setError('Please select a speed.');

    setSaving(true);
    setError('');

    const { error: dbError } = await supabase
      .from('crewmates')
      .insert([{ name: name.trim(), color, role, speed }]);

    setSaving(false);

    if (dbError) {
      setError('Failed to save crewmate: ' + dbError.message);
    } else {
      navigate('/gallery');
    }
  }

  return (
    <div>
      <Link to="/gallery" className="back-link">← Back to Gallery</Link>
      <div className="page-header">
        <h1 className="page-title">Add a New Crewmate</h1>
        <p className="page-subtitle">Design your crew member and send them aboard.</p>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Crewmate Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter a name…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
            />
          </div>

          {/* Role (category — stretch) */}
          <div className="form-group">
            <label className="form-label">Role</label>
            <div className="attr-options">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  className={'attr-option' + (role === r ? ' selected' : '')}
                  onClick={() => handleRoleChange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Speed (restricted by role — stretch) */}
          <div className="form-group">
            <label className="form-label">
              Speed
              {role && <span style={{ marginLeft: '0.5rem', fontWeight: 400, color: 'var(--accent)', fontSize: '0.75rem' }}>
                ({role}s unlock these speeds)
              </span>}
            </label>
            <div className="attr-options">
              {availableSpeeds.map(s => (
                <button
                  key={s}
                  type="button"
                  className={'attr-option' + (speed === s ? ' selected' : '')}
                  onClick={() => setSpeed(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-options">
              {COLORS.map(c => (
                <div key={c.name} className="color-swatch-wrap">
                  <div
                    className={'color-swatch' + (color === c.name ? ' selected' : '')}
                    style={{ background: c.hex }}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                  />
                  <span className="color-label">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" /> : null}
              {saving ? 'Saving…' : 'Add to Crew'}
            </button>
            <Link to="/gallery" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
