import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

export default function ForgotPassword() {
  const [mobile, setMobile] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{10}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.');
    // TODO: call authService.requestPasswordReset(mobile)
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="brand"><span>🌱</span> FarmAssist AI</div>
        <h1>Reset your password</h1>
        <p className="subtext">We'll send an OTP to your registered mobile number.</p>

        {sent ? (
          <div className="chip chip-leaf" style={{ display: 'block', textAlign: 'center', padding: 14 }}>
            OTP sent to +91 {mobile}. Check your messages.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fp-mobile">Mobile Number</label>
              <div className="input-wrap">
                <span className="prefix">+91</span>
                <input
                  id="fp-mobile" type="tel" inputMode="numeric" maxLength={10}
                  placeholder="98765 43210" value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <Button type="submit" variant="primary" block>Send OTP</Button>
            {error && <div className="error-text">{error}</div>}
          </form>
        )}

        <div className="switch-line"><Link to="/login">Back to log in</Link></div>
      </div>
    </div>
  );
}
