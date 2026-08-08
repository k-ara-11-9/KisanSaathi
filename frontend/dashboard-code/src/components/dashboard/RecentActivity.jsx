import React, { useState } from 'react';
import Card from '../common/Card';

const RANGE_TABS = ['12h', '24h', '48h', 'A Week', 'A Month'];

const PLANT_SECTIONS = [
  { key: 'leaf', name: 'Leaf', emoji: '🍃', samples: 921 },
  { key: 'root', name: 'Root', emoji: '🥕', samples: 9 },
  { key: 'twigs', name: 'Twigs', emoji: '🌿', samples: 20 },
  { key: 'stem', name: 'Stem', emoji: '🌱', samples: 1 },
];

const BAR_COUNT = 42;

/** Sprout Monitoring card — treatment match-rate chart + plant section breakdown. */
export function SproutMonitoringCard({ blockName = 'Mossco - Block A101', matchRate = 97 }) {
  const [range, setRange] = useState('12h');

  return (
    <Card>
      <div className="card-head">
        <h3>Sprout Monitoring</h3>
        <button className="card-menu-btn" aria-label="More options">•••</button>
      </div>

      <div className="tab-pills">
        {RANGE_TABS.map((t) => (
          <button
            key={t}
            className={`tab-pill${range === t ? ' active' : ''}`}
            onClick={() => setRange(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="block-title">
        {blockName}{' '}
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-dark)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
          +15%
        </span>
      </div>

      <div className="match-rate-bars" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <span key={i} style={{ height: `${30 + Math.round(Math.sin(i / 2) * 12) + 20}%` }} />
        ))}
      </div>

      <div className="rate-footline">
        <span>Treatment Match Rate</span>
        <b>{matchRate}% today</b>
      </div>

      <div className="plant-grid">
        {PLANT_SECTIONS.map((p) => (
          <div className="plant-tile" key={p.key}>
            <span className="emoji" aria-hidden="true">{p.emoji}</span>
            <div>
              <div className="p-name">{p.name}</div>
              <div className="p-count">{p.samples} samples</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const DEFAULT_LOG = [
  { icon: '🍃', title: 'Leaf scan completed — Block A101', time: '8 minutes ago', badge: 'Healthy' },
  { icon: '💧', title: 'Irrigation recommendation generated', time: '1 hour ago', badge: 'New' },
  { icon: '₹', title: 'Wheat mandi price updated', time: '3 hours ago', badge: '+2.4%' },
  { icon: '💬', title: 'You asked AgriAI about pest control', time: 'Yesterday', badge: null },
];

/** Recent activity feed for the dashboard sidebar column. */
export default function RecentActivity({ items = DEFAULT_LOG }) {
  return (
    <Card title="Recent Activity">
      {items.map((item, i) => (
        <div className="activity-item" key={i}>
          <span className="activity-icon" aria-hidden="true">{item.icon}</span>
          <div>
            <div className="activity-title">{item.title}</div>
            <div className="activity-time">{item.time}</div>
          </div>
          {item.badge && <span className="activity-badge">{item.badge}</span>}
        </div>
      ))}
    </Card>
  );
}
