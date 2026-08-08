import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { NOTIFICATIONS } from '../../utils/constants.js';

export default function Notifications() {
  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Alerts</div>
        <h1>Notifications</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NOTIFICATIONS.map((n, i) => (
          <Card key={i} style={n.unread ? { borderLeft: '3px solid var(--accent)' } : {}}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span className="activity-icon" aria-hidden="true">{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span className="chip chip-leaf">{n.tag}</span>
                  {n.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 3 }}>{n.title}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{n.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
