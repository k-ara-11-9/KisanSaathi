import React, { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import Loader from './Loader.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { reverseGeocode } from '../../utils/geo.js';

/**
 * Shows a permission-first flow for GPS capture:
 *   idle       -> "Share your location?" with Allow / Not now
 *   requesting -> spinner while the browser prompt is up
 *   granted    -> shows the detected place name / coordinates
 *   denied     -> explains it was blocked, how to re-enable it
 *
 * onDone(location) fires exactly once, with the captured location object
 * (or null if skipped/denied) — call your login/save logic from there.
 */
export default function LocationPermissionModal({ open, onDone }) {
  const { requestLocation } = useGeolocation();
  const [status, setStatus] = useState('idle');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setLocation(null);
    }
  }, [open]);

  if (!open) return null;

  const handleAllow = async () => {
    setStatus('requesting');
    try {
      const coords = await requestLocation();
      const placeName = await reverseGeocode(coords.latitude, coords.longitude);
      const loc = { ...coords, placeName };
      setLocation(loc);
      setStatus('granted');
    } catch (err) {
      setStatus('denied');
    }
  };

  const skip = () => onDone(null);

  return (
    <Modal onClose={skip}>
      {status === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <div className="modal-icon" aria-hidden="true">📍</div>
          <h3>Share your farm's location?</h3>
          <p>We'll use this for local weather alerts, nearby mandi prices, and disease outbreaks in your area.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="primary" block onClick={handleAllow}>Allow Location</Button>
            <Button variant="outline" block onClick={skip}>Not Now</Button>
          </div>
        </div>
      )}

      {status === 'requesting' && (
        <div style={{ textAlign: 'center' }}>
          <Loader block label="Waiting for permission..." />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Check for a permission prompt from your browser.
          </p>
        </div>
      )}

      {status === 'granted' && location && (
        <div style={{ textAlign: 'center' }}>
          <div className="modal-icon modal-icon-success" aria-hidden="true">✅</div>
          <h3>Location detected</h3>
          <p className="modal-location-value">
            {location.placeName || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </p>
          {location.placeName && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} (±{Math.round(location.accuracy)}m)
            </p>
          )}
          <Button variant="primary" block onClick={() => onDone(location)} style={{ marginTop: 14 }}>
            Continue
          </Button>
        </div>
      )}

      {status === 'denied' && (
        <div style={{ textAlign: 'center' }}>
          <div className="modal-icon modal-icon-danger" aria-hidden="true">🚫</div>
          <h3>Location blocked</h3>
          <p>You can turn it on later from your browser's site settings (usually the lock icon next to the address bar), or skip it for now.</p>
          <Button variant="outline" block onClick={skip} style={{ marginTop: 14 }}>
            Continue without location
          </Button>
        </div>
      )}
    </Modal>
  );
}
