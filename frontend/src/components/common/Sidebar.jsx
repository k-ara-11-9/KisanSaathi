import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/disease', label: 'Disease Detection', icon: '🍃' },
  { to: '/recommend', label: 'Smart Recommendations', icon: '💧' },
  { to: '/mandi', label: 'Mandi Prices', icon: '₹' },
  { to: '/history', label: 'History', icon: '⏱' },
  { to: '/profile', label: 'Profile', icon: '◔' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span role="img" aria-label="logo">🌱</span> FarmAssist
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        Crop health syncing every 12h. Last synced 8 min ago.
      </div>
    </aside>
  );
}
