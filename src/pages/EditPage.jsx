import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { COLORS, ROLES, ROLE_SPEEDS } from '../constants';

function colorHex(name) {
  return COLORS.find(c => c.name === name)?.hex ?? '#888';
}

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [role, setRole] = useState('');
  const [speed, setSpeed] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase
      .from('crewmates')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setOriginal(data);
          setName(data.name);
          setColor(data.color);
          setRole(data.role);
          setSpeed(data.speed);
        }
        setLoading(false);
      });
  }, [id]);

  const availableSpeeds = role ? ROLE_SPEEDS[role] : ['0.5x', '1x', '1.5x', '2x', '2.5x'];

  function handleRoleChange(r) {
    setRole(r);
    if (speed && !ROLE_SPEEDS[r].includes(speed)) setSpeed('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return setError('Name cannot be empty.');
    if (!color) return setError('Please select a color.');
    if (!role) return setError('Please select a role.');
    if (!speed) return setError('Please select a speed.');

    setSaving(true);
    setError('');
    setSuccess('');

    const { error: dbError } = await supabase
      .from('crewmates')
      .update({ name: name.trim(), color, role, speed })
      .eq('id', id);

    setSaving(false);

    if (dbError) {
      setError('Failed to update: ' + dbError.message);
    } else {
      setSuccess('Crewmate updated successfully!');
      setOriginal({ ...original, name: name.trim(), color, role, speed });
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${original?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('crewmates').delete().eq('id', id);
    navigate('/gallery');
  }

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;
  if (!original) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <div className="empty-state-title">Crewmate not found</div>
        <Link to="/gallery" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Gallery</Link>
      </div>
    );
  }

  const currentHex = colorHex(color);

  return (
    <div>
      <Link to={`/crewmate/${id}`} className="back-link">← Back to Details</Link>

      <div className="page-header">
        <h1 className="page-title">Edit Crewmate</h1>
        <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: colorHex(original.color), display: 'inline-block' }} />
          Currently: {original.name} · {original.role} · {original.color} · {original.speed}
        </p>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
            />
          </div>

          {/* Role */}
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

          {/* Speed */}
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
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link to={`/crewmate/${id}`} className="btn btn-secondary">Cancel</Link>
          </div>
        </form>

        <hr className="section-divider" />

        <div>
          <div style={{ marginBottom: '0.5rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Danger Zone
          </div>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <span className="spinner" /> : '🗑️'}
            {deleting ? 'Deleting…' : 'Delete Crewmate'}
          </button>
        </div>
      </div>
    </div>
  );
}
