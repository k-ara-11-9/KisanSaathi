import React from 'react';
import Card from '../common/Card';

/** Health Tracking card — mirrors the "Photosynthesis 139h of 160h" panel in the reference. */
export function HealthTrackingCard({ hours = 139, target = 160, treeLabel = 'Mossco Tree - A1201' }) {
  return (
    <Card>
      <div className="card-head">
        <h3>Health Tracking</h3>
        <button className="card-menu-btn" aria-label="More options">•••</button>
      </div>

      <div className="progress-line">
        14.97% production increase{' '}
        <span style={{ background: 'var(--accent)', color: '#0F1F14', fontWeight: 700, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100 }}>
          AI Insights
        </span>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="stat-label" style={{ marginBottom: 4 }}>
          Photosynthesis <span style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>+80%</span>
        </div>
        <div className="big-metric">
          {hours}h<span> of {target}h</span>
        </div>
      </div>

      <div className="dot-row" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <i key={i} className={i < 12 ? '' : i < 20 ? 'warn' : 'faint'} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
        <button className="card-menu-btn" aria-label="Previous">‹</button>
        <span className="stat-label">{treeLabel}</span>
        <button className="card-menu-btn" aria-label="Next">›</button>
      </div>
    </Card>
  );
}

const DEFAULT_NOTIFS = [
  { text: 'Rain expected in Block A101 within 6 hours — delay irrigation.', time: '10 min ago', unread: true },
  { text: 'Leaf scan flagged early blight risk on 3 samples.', time: '2 hours ago', unread: true },
  { text: 'Wheat prices at your nearest mandi rose 2.4%.', time: 'Yesterday', unread: false },
  { text: 'Monthly soil health report is ready.', time: '2 days ago', unread: false },
];

/** Notifications widget for the dashboard. */
export default function NotificationWidget({ notifications = DEFAULT_NOTIFS }) {
  return (
    <Card title="Notifications">
      {notifications.map((n, i) => (
        <div className="notif-item" key={i}>
          <span className={`notif-dot${n.unread ? ' unread' : ''}`} />
          <div>
            <div className="notif-text">{n.text}</div>
            <div className="notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}
