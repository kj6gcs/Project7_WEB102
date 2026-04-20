import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getCrewStrength } from '../constants';

export default function HomePage() {
  const [count, setCount] = useState(null);
  const [crewmates, setCrewmates] = useState([]);

  useEffect(() => {
    supabase
      .from('crewmates')
      .select('speed')
      .then(({ data }) => {
        if (data) {
          setCount(data.length);
          setCrewmates(data);
        }
      });
  }, []);

  const strength = getCrewStrength(crewmates);

  return (
    <div>
      <div className="home-hero">
        <span className="home-hero-icon">👨‍🚀</span>
        <h1 className="home-hero-title">Crewmate HQ</h1>
        <p className="home-hero-subtitle">
          Build your ultimate space crew. Assign roles, pick colors, and track your team
          across the stars — or among the stars, if you dare.
        </p>
        <div className="home-hero-actions">
          <Link to="/create" className="btn btn-primary">
            ＋ Add Crewmate
          </Link>
          <Link to="/gallery" className="btn btn-secondary">
            View Crew Gallery
          </Link>
        </div>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{count === null ? '…' : count}</div>
          <div className="stat-label">Crewmates Recruited</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{count === null ? '…' : strength + '%'}</div>
          <div className="stat-label">Crew Speed Index</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🛸</div>
          <div className="stat-label">Current Mission</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">?</div>
          <div className="stat-label">Imposters Among Us</div>
        </div>
      </div>
    </div>
  );
}
