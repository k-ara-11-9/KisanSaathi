import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import LocationPermissionModal from '../../components/common/LocationPermissionModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FEATURES, BENEFITS, TESTIMONIALS } from '../../utils/constants.js';
import '../../styles/agfarm.css';

const SOLUTIONS = FEATURES.slice(0, 4);

function AuthPanel() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'signup' && name.trim().length < 2) return setError('Please enter your full name.');
    if (!/^[0-9]{10}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setPendingUser({ name: name || 'Ramesh Kumar', mobile, block: 'Block A101' });
    setShowLocationModal(true); // show the permission popup before finishing
  };

  const finishAuth = (location) => {
    const user = location ? { ...pendingUser, location } : pendingUser;
    login(user);
    setShowLocationModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="af-auth-form-wrap">
      <div className="af-tabs">
        <button className={`af-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Log In</button>
        <button className={`af-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
      </div>

      <form onSubmit={submit}>
        {tab === 'signup' && (
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrap"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Kumar" /></div>
          </div>
        )}
        <div className="form-group">
          <label>Mobile Number</label>
          <div className="input-wrap">
            <span className="prefix">+91</span>
            <input
              type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210"
              value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-wrap">
            <input type="password" placeholder={tab === 'signup' ? 'Create a password' : 'Enter your password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <Button type="submit" variant="primary" block loading={loading}>
          {tab === 'login' ? 'Log In' : 'Create Account'}
        </Button>
        {error && <div className="error-text">{error}</div>}
      </form>

      <div className="switch-line">
        {tab === 'login' ? (
          <>New here? <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-dark)', fontWeight: 700 }}>Create an account</button></>
        ) : (
          <>Already registered? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-dark)', fontWeight: 700 }}>Log in</button></>
        )}
      </div>

      <LocationPermissionModal open={showLocationModal} onDone={finishAuth} />
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      {/* ===== Hero ===== */}
      <div className="af-hero">
        <nav className="af-nav">
          <div className="brand">🌱 KisanSaathi</div>
          <div className="links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#solutions">Solutions</a>
            <a href="#impact">Impact</a>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#get-started" className="cta-outline">Log In</a>
            <a href="#get-started" className="cta">Sign Up</a>
          </div>
        </nav>

        <div className="af-hero-inner">
          <div>
            <h1>Smart agriculture for a greener future</h1>
            <p>We help farmers improve productivity and sustainability through innovative agri-tech solutions.</p>
            <div className="ctas">
              <a href="#solutions" className="btn-white">Explore Solutions</a>
              <a href="#get-started" className="btn-line">Get Started Free</a>
            </div>
          </div>

          <div className="af-float-card">
            <img src="https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?w=200&q=80&auto=format&fit=crop" alt="Farmer using FarmAssist" />
            <div>
              <div className="title">Free Onboarding</div>
              <div className="meta">50k+ farmers joined</div>
            </div>
            <Link to="/register" className="join-btn" aria-label="Join now">↗</Link>
          </div>
        </div>
      </div>

      {/* ===== About — equal-width split, image balances the text ===== */}
      <div className="af-about" id="about">
        <div className="af-about-text">
          <div className="label">About Us</div>
          <h2>We help farmers improve productivity and sustainability through innovative agricultural solutions.</h2>
          <p>From real-time soil readings to mandi price alerts, FarmAssist AI brings every tool a modern farm needs into one simple app — built with input from the farmers who use it every day.</p>
          <a href="#solutions" className="af-outline-link">Explore Solutions</a>
        </div>
        <div className="af-about-media">
          <img src="https://images.unsplash.com/photo-1760635165251-5a3a81425a89?w=900&q=80&auto=format&fit=crop" alt="Tractor working a field" />
        </div>
      </div>
      {/* ===== Solutions / Services ===== */}
      <div className="af-section-head-row" id="solutions">
        <div>
          <div className="label">Solutions</div>
          <h2>Solutions for agriculture</h2>
        </div>
      </div>
      <div className="af-solutions">
        <div className="grid-4">
          {SOLUTIONS.map((f) => (
            <div className="card af-service-card" key={f.title}>
              <div className="icon" aria-hidden="true">{f.icon}</div>
              <div className="t">{f.title}</div>
              <div className="d">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Impact ===== */}
      <div className="af-impact-wrap" id="impact">
        <div className="af-impact-card">
          <div className="af-impact-content">
            <span className="badge">🏆 Achievement</span>
            <h3>Growing impact, harvesting success</h3>
            <p>Through dedication, smart innovation, and respect for nature, we've helped thousands of farmers grow more, sustainably.</p>
            <div className="af-impact-stats">
              <div><b>50k+</b><span>Farmers supported</span></div>
              <div><b>18%</b><span>Avg. profit uplift</span></div>
              <div><b>12</b><span>States covered</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Why it matters (benefits) ===== */}
      <div className="af-section-head-row">
        <div>
          <div className="label">Why FarmAssist</div>
          <h2>Built to move the numbers that matter</h2>
        </div>
      </div>
      <div className="af-solutions">
        {BENEFITS.map((b) => (
          <div className="benefit-row" key={b}>
            <span className="benefit-check">✓</span>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{b}</span>
          </div>
        ))}
      </div>

      {/* ===== Get started / auth — moved above testimonials ===== */}
      <div className="af-auth-section" id="get-started">
        <div className="af-auth-copy">
          <h2>Ready to grow smarter?</h2>
          <p>Create your free account and get personalized crop guidance, weather alerts, and mandi prices from day one.</p>
          <div className="stats-mini">
            <div><b>50k+</b><span>Farmers onboard</span></div>
            <div><b>4.8/5</b><span>Average rating</span></div>
          </div>
        </div>
        <AuthPanel />
      </div>

      {/* ===== Testimonials ===== */}
      <div className="af-section-head-row">
        <div>
          <div className="label">Testimonials</div>
          <h2>What our farmers say</h2>
        </div>
      </div>
      <div className="af-testimonials">
        <div className="grid-3">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="quote-mark">"</div>
              <p>{t.quote}</p>
              <div className="name">{t.name}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="site-footer">© 2026 KisanSaathi. Built for Indian farmers.</footer>
    </div>

    
  );
}
