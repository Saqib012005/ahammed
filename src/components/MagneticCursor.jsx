import { useEffect, useRef, useState } from 'react';

// Elegant magnetic cursor with a soft trailing glow
export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const raf = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    };
    raf();

    const hover = (e) => {
      const t = e.target;
      const isInteractive =
        t.closest('button, a, [data-magnetic]') !== null;
      ring.style.width = isInteractive ? '58px' : '34px';
      ring.style.height = isInteractive ? '58px' : '34px';
      ring.style.borderColor = isInteractive ? '#FF7A1A' : 'rgba(255,122,26,0.5)';
      dot.style.opacity = isInteractive ? '0' : '1';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', hover);
    window.addEventListener('mouseleave', () => setHidden(true));
    window.addEventListener('mouseenter', () => setHidden(false));
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', hover);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] hidden md:block ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 mix-blend-difference"
        style={{ borderColor: 'rgba(255,122,26,0.5)', transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--orange)]"
        style={{ transition: 'opacity 0.2s ease' }}
      />
    </div>
  );
}
