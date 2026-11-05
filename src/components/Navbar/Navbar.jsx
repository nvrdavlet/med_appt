import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AUTH_EVENT, getCurrentUser, logout } from '../../utils/auth';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(getCurrentUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setUser(getCurrentUser());
    window.addEventListener(AUTH_EVENT, refresh);
    return () => window.removeEventListener(AUTH_EVENT, refresh);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo" onClick={closeMenus}>
          StayHealthy
          <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="currentColor" />
            <path d="M27 14h10v13h13v10H37v13H27V37H14V27h13z" fill="#fff" />
          </svg>
        </Link>

        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenus}>Home</NavLink></li>
          <li><NavLink to="/booking-consultation" onClick={closeMenus}>Appointments</NavLink></li>
          <li><NavLink to="/instant-consultation" onClick={closeMenus}>Instant Consultation</NavLink></li>
          <li><NavLink to="/reviews" onClick={closeMenus}>Reviews</NavLink></li>

          {user ? (
            <>
              <li className="nav-user">
                <button className="nav-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  Welcome, {user.name.split(' ')[0]} ▾
                </button>
                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <Link to="/profile" onClick={closeMenus}>Your Profile</Link>
                    <Link to="/booking-consultation" onClick={closeMenus}>Your Appointments</Link>
                  </div>
                )}
              </li>
              <li><button className="btn btn-primary" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/signup" className="btn btn-primary" onClick={closeMenus}>Sign Up</Link></li>
              <li><Link to="/login" className="btn btn-outline" onClick={closeMenus}>Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
