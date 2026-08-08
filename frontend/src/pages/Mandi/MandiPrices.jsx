import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { MANDI_ROWS } from '../../utils/constants.js';

const TREND_ICON = { up: '▲', down: '▼', flat: '—' };
const TREND_CLASS = { up: 'trend-up', down: 'trend-down', flat: 'trend-flat' };

export default function MandiPrices() {
  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Market</div>
        <h1>Mandi Prices</h1>
      </div>

      <Card className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mandi</th><th>Distance</th><th>Price</th><th>Trend</th><th>Transport</th><th>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {MANDI_ROWS.map((r) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td>{r.dist}</td>
                <td className="mono" style={{ fontWeight: 600 }}>₹{r.price.toLocaleString('en-IN')}</td>
                <td className={TREND_CLASS[r.trend]}>{TREND_ICON[r.trend]}</td>
                <td className="mono">₹{r.transport}</td>
                <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>₹{r.profit.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
