import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LocationPermissionModal from '../../components/common/LocationPermissionModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLocationResult = (location) => {
    if (location) login({ ...user, location });
    setShowLocationModal(false);
  };

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Account</div>
        <h1>Profile</h1>
      </div>

      <div className="dash-grid">
        <div className="col-4">
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div className="avatar" style={{ margin: '0 auto 14px', width: 68, height: 68, fontSize: '1.3rem' }}>
                {user?.name?.split(' ').map((n) => n[0]).join('') || '—'}
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{user?.name || 'Guest'}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{user?.block || '—'}</div>
              <div style={{ marginTop: 18 }}>
                <Button variant="outline" block onClick={handleLogout}>Log Out</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-8">
          <Card title="Account Details">
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-wrap"><input readOnly value={user?.mobile ? `+91 ${user.mobile}` : ''} /></div>
            </div>
            <div className="form-group">
              <label>Farm Block</label>
              <div className="input-wrap"><input readOnly value={user?.block || ''} /></div>
            </div>
            <div className="form-group">
              <label>Farm Location (GPS)</label>
              <div className="input-wrap">
                <input
                  readOnly
                  value={
                    user?.location?.placeName
                      || (user?.location ? `${user.location.latitude.toFixed(4)}, ${user.location.longitude.toFixed(4)}` : '')
                  }
                  placeholder="Not captured yet"
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <Button variant="outline" size="sm" onClick={() => setShowLocationModal(true)}>
                  {user?.location ? 'Refresh location' : 'Detect my location'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <LocationPermissionModal open={showLocationModal} onDone={handleLocationResult} />
    </DashboardLayout>
  );
}
