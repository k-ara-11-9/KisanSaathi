import { useState, useCallback } from 'react';

/**
 * Wraps navigator.geolocation in a promise-based API with React state.
 * Call requestLocation() from a user-triggered event (button click, form
 * submit) — browsers won't reliably show the permission prompt otherwise.
 *
 * Usage:
 *   const { requestLocation, loading, error } = useGeolocation();
 *   const coords = await requestLocation(); // { latitude, longitude, accuracy }
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = 'Geolocation is not supported by this browser.';
        setError(message);
        reject(new Error(message));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            capturedAt: new Date().toISOString(),
          };
          setCoords(location);
          setLoading(false);
          resolve(location);
        },
        (err) => {
          // err.code: 1 = permission denied, 2 = position unavailable, 3 = timeout
          setError(err.message);
          setLoading(false);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { coords, error, loading, requestLocation };
}
