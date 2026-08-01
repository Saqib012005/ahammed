// ---------------------------------------------------------------------------
// Admin API client.
//
// Talks to the PHP backend (login.php / content.php / upload.php) for the hidden
// admin dashboard. The auth token is a short-lived HMAC-signed string returned
// by login.php; we keep it in localStorage and send it as a Bearer header on
// every write. All content edits hit the same JSON files the public site reads,
// so changes go live immediately (React Query re-fetches on invalidation).
// ---------------------------------------------------------------------------

import { API_BASE } from './content';

const TOKEN_KEY = 'tcs_admin_token';

// -- token storage ----------------------------------------------------------

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
}

export function clearToken() {
  setToken('');
}

export function isAuthed() {
  return Boolean(getToken());
}

// Thrown for any non-OK API response so callers can show a message and, on 401,
// bounce back to the login screen.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Parse a fetch Response, throwing ApiError with the server message on failure.
async function parse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    const msg = (body && (body.error || body.message)) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return body;
}

function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}

// -- auth --------------------------------------------------------------------

// Exchange the admin password for a token. Stores the token on success.
export async function login(password) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ password }),
  });
  const body = await parse(res);
  if (!body || !body.token) {
    throw new ApiError('No token returned', res.status);
  }
  setToken(body.token);
  return body;
}

export function logout() {
  clearToken();
}

// -- content CRUD ------------------------------------------------------------
// type is one of: 'blogs' | 'projects' | 'services' | 'testimonials'

// List a collection. When authed, blogs include unpublished drafts too.
export async function list(type) {
  const res = await fetch(`${API_BASE}/content.php?type=${encodeURIComponent(type)}`, {
    headers: authHeaders({ Accept: 'application/json' }),
  });
  const body = await parse(res);
  return Array.isArray(body) ? body : [];
}

export async function create(type, item) {
  const res = await fetch(`${API_BASE}/content.php?type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
    body: JSON.stringify(item),
  });
  return parse(res);
}

export async function update(type, item) {
  const res = await fetch(`${API_BASE}/content.php?type=${encodeURIComponent(type)}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
    body: JSON.stringify(item),
  });
  return parse(res);
}

export async function remove(type, id) {
  const res = await fetch(
    `${API_BASE}/content.php?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: authHeaders({ Accept: 'application/json' }),
    }
  );
  return parse(res);
}

// -- image upload ------------------------------------------------------------

// Upload one image file. Returns { id, media: 'media.php?f=<id>' }; store the
// `media` value in the content item's image/avatar field. mediaUrl() resolves it
// against the API base when rendering.
export async function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload.php`, {
    method: 'POST',
    headers: authHeaders({ Accept: 'application/json' }),
    body: form,
  });
  return parse(res);
}
