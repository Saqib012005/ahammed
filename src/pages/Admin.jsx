// ---------------------------------------------------------------------------
// Hidden admin page (route: /admin).
//
// Shows the login screen until a token is present, then the dashboard. The
// route is intentionally not linked anywhere in the public UI. Logout clears
// the token and returns to the login screen.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import { isAuthed, logout as clearAuth } from '../lib/admin';

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed());

  // Keep the browser tab title distinct from the public site.
  useEffect(() => {
    const prev = document.title;
    document.title = 'Admin · Content';
    return () => {
      document.title = prev;
    };
  }, []);

  function handleLogout() {
    clearAuth();
    setAuthed(false);
  }

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
