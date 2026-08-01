import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects, mediaUrl } from '../lib/content';

export default function Portfolio() {
  const { projects } = useProjects();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActive((current) => (current + 1) % projects.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [projects.length]);

  if (projects.length === 0) {
    return null;
  }

  const safeActive = active % projects.length;
  const current = projects[safeActive];
  const next = projects[(safeActive + 1) % projects.length];

  return (
    <section
      id="project"
      className="reveal bg-white border border-[var(--border-c)] rounded-3xl p-8 md:p-10 hover-lift relative overflow-hidden"
    >
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
          05
        </span>
        <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
          Portfolio Section
        </span>
      </div>

      <h2 className="font-serif-display text-3xl md:text-4xl leading-tight">
        Selected
        <br /> <span className="text-[var(--orange)] italic">Projects</span>
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {[current, next].map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="relative rounded-[26px] overflow-hidden aspect-[4/3] group tilt-card bg-[var(--gray-section)] border border-black/5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)]"
          >
            <img
              src={mediaUrl(p.image)}
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[1.06] contrast-[1.04] brightness-[0.97]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white font-serif-display text-3xl drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]">
              {p.title.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {(current.tags || []).map((t) => (
          <span
            key={t}
            className="text-xs border border-[var(--border-c)] rounded-full px-3 py-1.5 text-[var(--text-secondary)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors cursor-default"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif-display text-2xl">{current.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-md">
            {current.description}
          </p>
        </div>
        <button className="shrink-0 w-12 h-12 rounded-full bg-[var(--orange)] text-white flex items-center justify-center hover:rotate-45 transition-transform duration-300 shadow-lg">
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i
                  ? 'bg-[var(--orange)] w-8'
                  : 'bg-[var(--border-c)] w-2 hover:bg-[var(--text-muted)]'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setActive((a) => (a - 1 + projects.length) % projects.length)
            }
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-[var(--border-c)] flex items-center justify-center hover:bg-[var(--dark-bg)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActive((a) => (a + 1) % projects.length)}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-[var(--border-c)] flex items-center justify-center hover:bg-[var(--dark-bg)] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
