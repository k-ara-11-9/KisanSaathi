import React from 'react';

/**
 * Generic card shell used across the dashboard.
 * Props:
 *  - title: optional header text
 *  - onMenuClick: optional handler for the "..." menu button
 *  - className: extra classes to merge (e.g. grid col-span helpers)
 */
export default function Card({ title, onMenuClick, className = '', style, children }) {
  return (
    <div className={`card ${className}`} style={style}>
      {title && (
        <div className="card-head">
          <h3>{title}</h3>
          {onMenuClick && (
            <button className="card-menu-btn" onClick={onMenuClick} aria-label="More options">
              •••
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
