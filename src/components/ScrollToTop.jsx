import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to the top of the page on every route change (unless a hash anchor is present).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // let anchor links handle their own scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  return null;
}
