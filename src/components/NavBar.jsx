import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🚀</span>
        <span className="navbar-brand-name">Crewmate HQ</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
        >
          Home
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
        >
          + New Crewmate
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
        >
          Crew Gallery
        </NavLink>
      </div>
    </nav>
  );
}
