import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: 8 }}>404</div>
        <p className="subtext">This page doesn't exist.</p>
        <Link to="/"><Button variant="primary">Back home</Button></Link>
      </div>
    </div>
  );
}
