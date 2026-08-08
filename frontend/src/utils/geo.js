/**
 * Converts lat/lon into a readable place name using OpenStreetMap's
 * free Nominatim API (no API key required). Rate-limited to ~1 req/sec
 * by their usage policy — fine for one call per login.
 *
 * Returns something like: "Lasalgaon, Niphad, Nashik, Maharashtra"
 * or null if the lookup fails (never throws — this is enrichment,
 * not a requirement).
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.village || a.town || a.suburb || a.hamlet,
      a.county || a.state_district,
      a.state,
    ].filter(Boolean);

    return parts.length ? parts.join(', ') : (data.display_name || null);
  } catch {
    return null;
  }
}
