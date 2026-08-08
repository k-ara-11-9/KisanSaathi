import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const name = user?.name || 'Ramesh Kumar';
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="navbar">
      <div className="navbar-search">
        <span aria-hidden="true">🔍</span>
        <input type="text" placeholder="Search crops, fields, reports..." />
      </div>

      <div className="navbar-right">
        <button className="icon-btn" aria-label="Notifications">
          🔔<span className="dot" />
        </button>
        <button className="icon-btn" aria-label="Help">?</button>
        <div className="navbar-profile">
          <span className="avatar">{initials}</span>
          <div>
            <div className="name">{name}</div>
            <div className="role">Block A101 · Farmer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
