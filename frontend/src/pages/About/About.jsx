import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import { TECH, TEAM } from '../../utils/constants.js';

export default function About() {
  return (
    <div>
      <nav className="marketing-nav">
        <div className="brand"><span>🌱</span> FarmAssist AI</div>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
        </div>
      </nav>

      <header className="mkt-hero">
        <div className="eyebrow">About the project</div>
        <h1>Built by a small team that grew up around farms</h1>
        <p>FarmAssist AI combines computer vision, weather data, and IoT soil sensors into one simple app.</p>
      </header>

      <section className="section">
        <div className="section-head"><h2>Tech stack</h2></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {TECH.map((t) => <span className="chip" key={t}>{t}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Team</h2></div>
        <div className="grid-4">
          {TEAM.map((m) => (
            <Card key={m.name} className="" >
              <div style={{ textAlign: 'center' }}>
                <div className="avatar" style={{ margin: '0 auto 12px', width: 56, height: 56, fontSize: '1rem' }}>
                  {m.name.split(' ').map((x) => x[0]).join('')}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="site-footer">© 2026 FarmAssist AI.</footer>
    </div>
  );
}
