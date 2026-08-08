import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18 }} />
    </div>
  );
}

export default function Settings() {
  const [notifs, setNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Preferences</div>
        <h1>Settings</h1>
      </div>

      <div className="col-6">
        <Card title="Notifications">
          <ToggleRow label="Push notifications" desc="Disease alerts, weather warnings, irrigation reminders" checked={notifs} onChange={(e) => setNotifs(e.target.checked)} />
          <ToggleRow label="SMS alerts" desc="Critical alerts sent via SMS as backup" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
          <ToggleRow label="Weekly digest" desc="A summary email every Monday morning" checked={weeklyDigest} onChange={(e) => setWeeklyDigest(e.target.checked)} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
