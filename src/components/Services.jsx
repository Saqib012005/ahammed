import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useServices, mediaUrl } from '../lib/content';
import { trackServiceClick } from '../lib/analytics';
import Tilt3D from './Tilt3D';

export default function Services() {
  const { services } = useServices();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (services.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActive((current) => (current + 1) % services.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [services.length]);

  const visible = services.slice(active, active + 3).concat(
    services.slice(0, Math.max(0, active + 3 - services.length))
  );

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const card = {
    hidden: { opacity: 0, y: 60, rotateX: -15 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="services"
      className="relative bg-[var(--dark-bg)] text-white py-20 px-4 md:px-10 lg:px-16 rounded-[40px] mx-4 md:mx-10 lg:mx-16 my-10 noise-overlay overflow-hidden"
    >
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[var(--orange)] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 w-80 h-80 rounded-full bg-[var(--orange-light)] opacity-20 blur-3xl" />

      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif-display text-5xl md:text-6xl leading-tight">
            My <span className="text-[var(--orange)] italic">Services</span>
          </h2>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Results-driven digital marketing services focused on lead generation,
            conversion optimization, persuasive copywriting, and measurable growth.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          key={active}
        >
          {visible.map((s, idx) => (
            <motion.div key={`${s.id}-${idx}`} variants={card}>
              <Tilt3D max={10} className="h-full">
                <div className="relative bg-white/[0.04] border border-white/10 rounded-3xl p-5 backdrop-blur-sm hover:bg-white/[0.07] transition-colors duration-500 group h-full">
                  <h3 className="text-2xl font-medium mb-4 px-2">{s.title}</h3>
                  <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] bg-white/5 border border-white/10 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.85)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent z-10" />
                    <img
                      src={mediaUrl(s.image)}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[1.05] contrast-[1.03] brightness-[0.96]"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      aria-label="View service"
                      data-magnetic
                      onClick={() => trackServiceClick(s.title)}
                      className="absolute bottom-4 right-4 z-20 w-14 h-14 rounded-full bg-[var(--timeline-dark)] text-white flex items-center justify-center hover:bg-[var(--orange)] hover:rotate-45 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45)] ring-2 ring-white/10"
                    >
                      <ArrowUpRight className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-white/60 text-sm mt-4 px-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-2 mt-10">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i
                  ? 'bg-[var(--orange)] w-8'
                  : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
