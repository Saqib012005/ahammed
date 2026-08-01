import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MagneticCursor from './components/MagneticCursor';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import useReveal from './hooks/useReveal';
import { Toaster } from './components/ui/sonner';

function App() {
  const location = useLocation();

  // The hidden admin area is a self-contained full-screen UI: no public
  // Navbar/Footer/cursor chrome, and it manages its own layout.
  const isAdmin = location.pathname.startsWith('/admin');


  // Re-run reveal observers whenever the route changes so new page content animates in.
  useReveal(location.pathname);

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
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className="App bg-[var(--main-bg)]">
      <MagneticCursor />
      <ScrollToTop />
      <Navbar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );

}

export default App;
