import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

const ACTIONS = [
  { icon: '🍃', name: 'Disease Detection', desc: 'Scan a leaf photo', to: '/disease' },
  { icon: '💧', name: 'Smart Recommendation', desc: 'Irrigation & fertilizer', to: '/recommend' },
  { icon: '₹', name: 'Mandi Prices', desc: 'Today\'s market rates', to: '/mandi' },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="qa-grid">
      {ACTIONS.map((a) => (
        <Card key={a.to} className="qa-tile" onMenuClick={undefined}>
          <div onClick={() => navigate(a.to)} style={{ display: 'contents' }}>
            <div className="qa-icon" aria-hidden="true">{a.icon}</div>
            <div className="qa-name">{a.name}</div>
            <div className="qa-desc">{a.desc}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
