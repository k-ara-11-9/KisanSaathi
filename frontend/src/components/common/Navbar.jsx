import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NOTIFICATIONS } from '../../utils/constants.js';

const HELP_ITEMS = [
  { icon: '📘', label: 'Getting started guide', href: '#' },
  { icon: '💬', label: 'Contact support', href: '#' },
  { icon: '🐛', label: 'Report an issue', href: '#' },
  { icon: '📄', label: 'FAQs', href: '#' },
];

export default function Navbar() {
  const { user } = useAuth();
  const name = user?.name || 'Ramesh Kumar';
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  const [showNotif, setShowNotif] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const notifRef = useRef(null);
  const helpRef = useRef(null);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  // Close either popover when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-search">
        <span aria-hidden="true">🔍</span>
        <input type="text" placeholder="Search crops, fields, reports..." />
      </div>

      <div className="navbar-right">
        <div className="nb-popover-wrap" ref={notifRef}>
          <button
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => { setShowNotif((v) => !v); setShowHelp(false); }}
          >
            🔔{unreadCount > 0 && <span className="dot" />}
          </button>

          {showNotif && (
            <div className="nb-popover">
              <div className="nb-popover-head">Notifications</div>
              <div className="nb-popover-body">
                {NOTIFICATIONS.map((n, i) => (
                  <div className="notif-item" key={i}>
                    <span className={`notif-dot${n.unread ? ' unread' : ''}`} />
                    <div>
                      <div className="notif-text">{n.title}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="nb-popover-wrap" ref={helpRef}>
          <button
            className="icon-btn"
            aria-label="Help"
            onClick={() => { setShowHelp((v) => !v); setShowNotif(false); }}
          >
            ?
          </button>

          {showHelp && (
            <div className="nb-popover">
              <div className="nb-popover-head">Help & Support</div>
              <div className="nb-popover-body">
                {HELP_ITEMS.map((h) => (
                  <a className="nb-help-item" href={h.href} key={h.label}>
                    <span aria-hidden="true">{h.icon}</span> {h.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

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
