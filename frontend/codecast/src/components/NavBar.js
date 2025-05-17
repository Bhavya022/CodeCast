import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

export default function NavBar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper for avatar/initials
  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span style={{fontWeight:700, fontSize:'1.5rem', letterSpacing:'1px'}}>🖥️ CodeCast</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && user.role === 'creator' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/upload">Upload</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/creator-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/@${user.username}`}>My Portfolio</Link>
                </li>
              </>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">Admin</Link>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/playlists">Playlists</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {user ? (
              <>
                <li className="nav-item d-flex align-items-center me-2">
                  <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2" style={{width:32, height:32, fontWeight:600, fontSize:'1.1rem'}}>
                    {getInitials(user.username)}
                  </div>
                  <span className="nav-link p-0">{user.username} <span className="badge bg-secondary text-light ms-1" style={{fontSize:'0.8em'}}>{user.role}</span></span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 