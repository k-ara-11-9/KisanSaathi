import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import LocationPermissionModal from '../../components/common/LocationPermissionModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
// import { register as registerRequest } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Please enter your full name.');
    if (!/^[0-9]{10}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (!agreed) return setError('Please accept the Terms & Privacy Policy.');

    setLoading(true);
    try {
      // const user = await registerRequest({ name, mobile, password });
      const user = { name, mobile, block: 'Unassigned' }; // mock
      setPendingUser(user);
      setLoading(false);
      setShowLocationModal(true); // show the permission popup before finishing signup
    } catch (err) {
      setError('Could not create account. Try again.');
      setLoading(false);
    }
  };

  const finishRegister = (location) => {
    const user = location ? { ...pendingUser, location } : pendingUser;
    // TODO: if location was captured, include it in the registration payload
    login(user);
    setShowLocationModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="brand"><span>🌱</span> FarmAssist AI</div>
        <h1>Create your account</h1>
        <p className="subtext">Join thousands of farmers using FarmAssist AI to grow smarter.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <div className="input-wrap">
              <input id="signup-name" type="text" placeholder="Ramesh Kumar" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-mobile">Mobile Number</label>
            <div className="input-wrap">
              <span className="prefix">+91</span>
              <input
                id="signup-mobile" type="tel" inputMode="numeric" maxLength={10}
                placeholder="98765 43210" value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-pass">Password</label>
            <div className="input-wrap">
              <input
                id="signup-pass" type={showPass ? 'text' : 'password'}
                placeholder="Create a password" value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass((s) => !s)}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="row-between">
            <label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              I agree to the Terms & Privacy Policy
            </label>
          </div>

          <Button type="submit" variant="primary" block loading={loading}>Create Account</Button>
          {error && <div className="error-text">{error}</div>}
        </form>

        <div className="switch-line">Already have an account? <Link to="/login">Log in</Link></div>
      </div>

      <LocationPermissionModal open={showLocationModal} onDone={finishRegister} />
    </div>
  );
}
