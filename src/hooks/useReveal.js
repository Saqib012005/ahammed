import { useEffect } from 'react';

// Reveals elements with the `.reveal` class as they scroll into view.
// Pass a `key` (e.g. the current pathname) so the observer re-attaches after route changes.
export default function useReveal(key) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}
