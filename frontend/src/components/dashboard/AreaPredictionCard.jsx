import React from 'react';
import Card from '../common/Card';

/** "Area prediction model" scanning panel from the reference design. */
export default function AreaPredictionCard({ status = 'Checking...', good = true }) {
  return (
    <Card>
      <div className="card-head">
        <h3>Area Prediction Model</h3>
        <span className="stat-label">{good ? 'Good for planting' : 'Needs review'}</span>
      </div>

      <div className="scan-track" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => <span key={i} />)}
      </div>

      <div className="scan-status">
        <span className="badge">
          <span className="loader" /> {status}
        </span>
        <span className="stat-label">AI is scanning every part of the plant</span>
      </div>
    </Card>
  );
}
