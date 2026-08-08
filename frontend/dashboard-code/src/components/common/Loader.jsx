import React from 'react';

/**
 * block: renders centered inside a padded container (for card/page loading states)
 * label: optional text shown next to the spinner
 */
export default function Loader({ block = false, label }) {
  if (block) {
    return (
      <div className="loader-block">
        <span className="loader" />
        {label && <span style={{ marginLeft: 10, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>}
      </div>
    );
  }
  return <span className="loader" />;
}
