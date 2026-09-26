import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MagneticCursor from './components/MagneticCursor';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import useReveal from './hooks/useReveal';
import { trackPageView } from './lib/analytics';
import { Toaster } from './components/ui/sonner';

// Code split secondary routes to drastically reduce initial JavaScript load
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  const location = useLocation();

  // The hidden admin area is a self-contained full-screen UI: no public
  // Navbar/Footer/cursor chrome, and it manages its own layout.
  const isAdmin = location.pathname.startsWith('/admin');

  // Re-run reveal observers whenever the route changes so new page content animates in.
  useReveal(location.pathname);

  // GA4 page_view on initial load and on every client-side route change. The
  // private /admin area is deliberately excluded from marketing analytics.
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    trackPageView({ path: location.pathname + location.search });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Admin renders on its own, without the public chrome.
  if (isAdmin) {
    return (
      <div className="admin-page">
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-neutral-900" />}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="App bg-[var(--main-bg)]">
      <MagneticCursor />
      <ScrollToTop />
      <Navbar />
      <main className="relative">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
