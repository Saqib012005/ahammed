import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { navLinks } from '../mock';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigate to a section: if we're on the homepage, smooth-scroll; otherwise
  // route home first and scroll once the target section has mounted.
  const goToSection = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const isActive = (link) => {
    if (link.to) return location.pathname === link.to;
    return false;
  };

  const renderLink = (link) => {
    const active = isActive(link);
    const cls = `px-4 md:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
      active
        ? 'bg-[var(--orange)] text-white shadow-lg'
        : 'text-white/80 hover:text-white'
    }`;

    // Section anchors (no `to`) scroll within/toward the homepage.
    if (!link.to) {
      return (
        <button key={link.label} onClick={() => goToSection(link.id)} className={cls}>
          {link.label}
        </button>
      );
    }
    // Route links navigate between pages.
    return (
      <Link key={link.label} to={link.to} className={cls}>
        {link.label}
      </Link>
    );
  };

  const left = navLinks.slice(0, 3);
  const right = navLinks.slice(3);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? 'scale-95' : 'scale-100'
      }`}
    >
      <nav className="flex items-center gap-1 bg-[var(--navbar-bg)] text-white rounded-full px-2 py-2 shadow-2xl border border-white/5 backdrop-blur-md">
        {left.map(renderLink)}

        <Link to="/" className="mx-2 md:mx-4 flex items-center gap-2" aria-label="Home">
          <div className="w-8 h-8 rounded-full bg-[var(--orange)] flex items-center justify-center text-white font-bold text-xs">
            J
          </div>
          <span className="hidden sm:inline font-bold tracking-wide text-base">JOHN</span>
        </Link>

        {right.map(renderLink)}
      </nav>
    </div>
  );
}
