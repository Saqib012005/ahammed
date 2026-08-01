import { motion } from 'framer-motion';
import { workExperience } from '../mock';

export default function WorkExperience() {
  return (
    <motion.section
      id="about"
      className="bg-white border border-[var(--border-c)] rounded-3xl p-8 md:p-10"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
          03
        </span>
        <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
          Work Experience
        </span>
      </div>
      <h2 className="font-serif-display text-4xl md:text-5xl mb-10">
        My <span className="text-[var(--orange)] italic">Work Experience</span>
      </h2>

      <div className="relative">
        <div className="absolute left-[44%] top-2 bottom-2 w-px bg-[var(--border-c)] hidden md:block" />

        <ul className="space-y-8">
          {workExperience.map((w, i) => (
            <motion.li
              key={w.id}
              className="grid md:grid-cols-2 gap-6 items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="md:pr-10 md:text-right">
                <div className="font-medium text-lg">{w.company}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {w.role}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {w.duration}
                </div>
              </div>
              <div className="relative md:pl-10">
                <motion.div
                  className={`hidden md:block absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full ${
                    i === 0
                      ? 'bg-[var(--orange)] ring-4 ring-[var(--orange-highlight)]'
                      : 'bg-[var(--timeline-dark)]'
                  }`}
                  animate={i === 0 ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="font-medium text-lg">{w.title}</div>
                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {w.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
