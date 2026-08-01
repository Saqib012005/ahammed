import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WorkExperience from '../components/WorkExperience';
import WhyHireMe from '../components/WhyHireMe';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import CtaBanner from '../components/CtaBanner';
import BlogPreview from '../components/BlogPreview';

export default function Home() {
  const location = useLocation();

  // When navigating home from another page with a target section, scroll to it.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <Services />
      <div className="grid lg:grid-cols-2 gap-6 px-4 md:px-10 lg:px-16 py-16 max-w-[1400px] mx-auto">
        <WorkExperience />
        <WhyHireMe />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 px-4 md:px-10 lg:px-16 pb-16 max-w-[1400px] mx-auto">
        <Portfolio />
        <Testimonials />
      </div>
      <CtaBanner />
      <BlogPreview />
    </>
  );
}
