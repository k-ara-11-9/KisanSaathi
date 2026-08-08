import React from 'react';
import Card from '../common/Card';

const STATS = [
  { icon: '🌱', value: '921', label: 'Leaf samples', trend: '+15%', up: true },
  { icon: '💧', value: '87%', label: 'Soil moisture', trend: '+4%', up: true },
  { icon: '🌡️', value: '0.689', label: 'Chl GLCM level', trend: '-2%', up: false },
];

function HealthRing({ score = 80 }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="health-ring-wrap">
      <div className="health-ring">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={radius} fill="none" stroke="var(--accent-soft)" strokeWidth="12" />
          <circle
            cx="74" cy="74" r={radius} fill="none"
            stroke="var(--accent)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="ring-center">
          <span className="ring-value">{score}%</span>
          <span className="ring-label">Health Score</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Row of quick metric tiles (leaf samples, soil moisture, chlorophyll level).
 * Pass `stats` to override the mock defaults with live data from useFetch/services.
 */
export default function StatsCards({ stats = STATS }) {
  return (
    <div className="dash-grid">
      {stats.map((s) => (
        <div className="col-4" key={s.label}>
          <Card className="stat-card">
            <div className="stat-icon" aria-hidden="true">{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <span className={`stat-trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
          </Card>
        </div>
      ))}
    </div>
  );
}

export { HealthRing, STATS };
