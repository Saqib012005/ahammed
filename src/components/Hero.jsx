import { Star, ArrowUpRight, Sparkles, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroData } from '../mock';
import { trackCtaClick } from '../lib/analytics';

const HeroScene = lazy(() => import('./HeroScene'));

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 px-4 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* 3D scene layer — decorative, behind content */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Soft radial glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,196,141,0.25) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto relative">
        {/* Hello badge */}
        <motion.div
          className="flex justify-center mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 bg-white shadow-md border border-[var(--border-c)] rounded-full px-5 py-2">
            <span className="font-handwrite text-2xl text-[var(--orange)] leading-none">
              Hello
            </span>
            <motion.div
              animate={{ rotate: [0, 20, -10, 20, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Hand className="w-5 h-5 text-[var(--orange)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-center font-serif-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.05] tracking-[-0.04em]"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          I&apos;m{' '}
          <span className="text-[var(--orange)] italic inline-block">
            {heroData.name}.
          </span>
          <br />
          {heroData.role}
        </motion.h1>

        {/* Hero content layout */}
        <div className="relative mt-12 flex flex-col items-center">
          <motion.div
            className="relative w-[300px] sm:w-[380px] md:w-[480px] aspect-square"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 35%, #FFC38D 0%, #FFA45C 50%, #FF7A1A 100%)',
                boxShadow: '0 30px 80px -10px rgba(255, 122, 26, 0.55)',
              }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="absolute -inset-6 rounded-full border-2 border-dashed border-[var(--orange-light)]/60 spin-slow"
              aria-hidden
            />
            <Sparkles className="absolute -top-2 right-6 w-7 h-7 text-[var(--orange)] float-medium z-20" />
            <Sparkles className="absolute bottom-10 -left-4 w-5 h-5 text-[var(--orange)] float-slow z-20" />

            <motion.div
              className="absolute inset-[6%] rounded-full overflow-hidden ring-4 ring-white/30"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <img
                src={heroData.portrait}
                alt={heroData.name}
                className="w-full h-full object-cover object-center"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </motion.div>
          </motion.div>

          {/* Left description bubble */}
          <motion.div
            className="hidden md:block absolute left-0 top-10 max-w-[230px]"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-5xl text-[var(--orange)] font-serif-display leading-none mb-2">
              &ldquo;
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
              {heroData.description}
            </p>
            <svg
              className="mt-3"
              width="80"
              height="30"
              viewBox="0 0 80 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 25 C 20 5, 50 5, 78 20"
                stroke="#FF7A1A"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="3 4"
              />
              <path
                d="M70 14 L78 20 L72 26"
                stroke="#FF7A1A"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Right experience bubble */}
          <motion.div
            className="hidden md:block absolute right-0 top-10 text-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-1 justify-end mb-2">
              {Array.from({ length: heroData.rating }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + i * 0.1, type: 'spring', stiffness: 300 }}
                >
                  <Star className="w-4 h-4 fill-[var(--orange)] text-[var(--orange)]" />
                </motion.div>
              ))}
            </div>
            <div className="text-5xl font-serif-display leading-none">
              {heroData.experience}
            </div>
            <div className="text-[var(--text-secondary)] text-sm mt-1">
              {heroData.experienceLabel}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="mt-10 flex items-center gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            <motion.button
              className="group inline-flex items-center gap-2 bg-[var(--dark-bg)] text-white rounded-full pl-6 pr-2 py-2 font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05, backgroundColor: '#FF7A1A' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                trackCtaClick('Hire Me', 'hero');
                navigate('/contact');
              }}
              data-magnetic
            >
              Hire Me
              <motion.span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--orange)] text-white"
                whileHover={{ rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => {
                trackCtaClick("Let's Talk", 'hero');
                navigate('/contact');
              }}
              className="text-[var(--text-primary)] font-medium underline underline-offset-4 decoration-2 decoration-[var(--orange)] hover:text-[var(--orange)] transition-colors"
              data-magnetic
            >
              Let&apos;s Talk
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
