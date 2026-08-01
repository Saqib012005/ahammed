import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { whyHireMe } from '../mock';
import CountUp from './CountUp';

export default function WhyHireMe() {
  const navigate = useNavigate();

  return (
    <motion.section
      className="bg-white border border-[var(--border-c)] rounded-3xl p-8 md:p-10"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
          04
        </span>
        <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
          Why Hire Me
        </span>
      </div>

      <div className="grid md:grid-cols-5 gap-6 items-center">
        <motion.div
          className="md:col-span-2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="relative rounded-3xl aspect-[3/4] overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, #FFC38D 0%, #FFA45C 60%, #FF7A1A 100%)',
            }}
          >
            <img
              src={whyHireMe.portrait}
              alt="John portrait"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        <div className="md:col-span-3">
          <h2 className="font-serif-display text-3xl md:text-4xl leading-tight">
            Why <span className="text-[var(--orange)] italic">Hire Me?</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            {whyHireMe.description}
          </p>

          <div className="flex gap-8 mt-8">
            {whyHireMe.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif-display text-3xl text-[var(--orange)]">
                  <CountUp end={parseInt(stat.value)} />
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/contact')}
            data-magnetic
            className="group mt-8 inline-flex items-center gap-2 border border-[var(--border-c)] rounded-full pl-5 pr-2 py-2 font-medium hover:bg-[var(--dark-bg)] hover:text-white transition-all duration-300"
          >
            Hire me
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--orange)] text-white group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
