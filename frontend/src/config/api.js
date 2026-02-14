// Central API configuration for the R&D Website
// All data fetching goes through the backend caching server

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Get the API URL for a sheet endpoint.
 * In development, the Vite proxy forwards /api/* to the backend server.
 * In production, set VITE_API_URL to the backend server URL.
 *
 * @param {string} sheetName - e.g. 'sponsored', 'consultancy', 'lab-biosciences'
 * @returns {string} Full API URL
 */
export const getApiUrl = (sheetName) => `${API_BASE}/api/sheets/${sheetName}`;

/**
 * Get the API URL for content endpoints (HTML documents).
 *
 * @param {string} name - e.g. 'dean-message'
 * @returns {string} Full API URL
 */
export const getContentUrl = (name) => `${API_BASE}/api/content/${name}`;

/**
 * Get the sheet-status URL (used by sidebar to hide empty sheets).
 * @returns {string}
 */
export const getSheetsStatusUrl = () => `${API_BASE}/api/sheets-status`;

// ─── Admin helpers ───────────────────────────────────────────────────────────

const TOKEN_KEY = 'admin_token';

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** POST /api/admin/login — returns { token } on success */
export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }
  const data = await res.json();
  setAdminToken(data.token);
  return data;
}

/** Verify current token is still valid */
export async function adminVerify() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Logout — clears token both locally and server-side */
export async function adminLogout() {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  }
  clearAdminToken();
}

export default API_BASE;
