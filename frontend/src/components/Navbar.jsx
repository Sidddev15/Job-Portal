import React from 'react';
import { useAuth } from '../auth/authContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <nav
      style={{
        padding: 12,
        background: '#f8f8f8',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Link to="/">Job Portal</Link>
      {user && (
        <>
          <span>
            Hello, {user.name} <small>({user.role})</small>
          </span>
          <Link to={`/${user.role}/dashboard`}>Dashboard</Link>
          <button onClick={handleLogout} style={{ marginLeft: 12 }}>
            Logout
          </button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
