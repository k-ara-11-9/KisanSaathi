import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import LocationPermissionModal from '../../components/common/LocationPermissionModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
// import { login as loginRequest } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{10}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      // const user = await loginRequest({ mobile, password });
      const user = { name: 'Ramesh Kumar', mobile, block: 'Block A101' }; // mock
      setPendingUser(user);
      setLoading(false);
      setShowLocationModal(true); // show the permission popup before finishing login
    } catch (err) {
      setError('Login failed. Check your number and password.');
      setLoading(false);
    }
  };

  const finishLogin = (location) => {
    const user = location ? { ...pendingUser, location } : pendingUser;
    // TODO: if location was captured, send it to your backend here, e.g.
    // await updateUserLocation(user.id, location);
    login(user);
    setShowLocationModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="brand"><span>🌱</span> FarmAssist AI</div>
        <h1>Welcome back</h1>
        <p className="subtext">Log in with your mobile number to check prices, weather, and advisories.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-mobile">Mobile Number</label>
            <div className="input-wrap">
              <span className="prefix">+91</span>
              <input
                id="login-mobile" type="tel" inputMode="numeric" maxLength={10}
                placeholder="98765 43210" value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">Password</label>
            <div className="input-wrap">
              <input
                id="login-pass" type={showPass ? 'text' : 'password'}
                placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass((s) => !s)}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="row-between">
            <label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Button type="submit" variant="primary" block loading={loading}>Log In</Button>
          {error && <div className="error-text">{error}</div>}
        </form>

        <div className="switch-line">New to FarmAssist? <Link to="/register">Create an account</Link></div>
      </div>

      <LocationPermissionModal open={showLocationModal} onDone={finishLogin} />
    </div>
  );
}
