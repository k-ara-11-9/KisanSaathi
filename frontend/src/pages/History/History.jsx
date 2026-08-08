import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { HISTORY_ROWS } from '../../utils/constants.js';

const RESULT_CHIP = { Healthy: 'chip-leaf', Treated: 'chip-ochre', Contained: 'chip-danger' };

export default function History() {
  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Records</div>
        <h1>History</h1>
      </div>

      <Card className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Crop</th><th>Disease</th><th>Recommendation</th><th>Weather</th><th>Result</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_ROWS.map((h, i) => (
              <tr key={i}>
                <td>{h.date}</td>
                <td style={{ fontWeight: 500 }}>{h.crop}</td>
                <td>{h.disease}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.rec}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.weather}</td>
                <td><span className={`chip ${RESULT_CHIP[h.result] || ''}`}>{h.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
