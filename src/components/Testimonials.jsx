import { useState } from 'react';
import { Star, Send, Sparkles } from 'lucide-react';
import { useTestimonials, mediaUrl } from '../lib/content';

export default function Testimonials() {
  const { testimonials } = useTestimonials();
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) {
    return null;
  }

  const safeActive = active % testimonials.length;
  const visible = [
    testimonials[safeActive],
    testimonials[(safeActive + 1) % testimonials.length],
  ];

  return (
    <section className="reveal relative bg-[var(--dark-bg)] text-white rounded-3xl p-8 md:p-10 overflow-hidden noise-overlay hover-lift">
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
          06
        </span>
        <span className="text-white/60 text-xs tracking-widest uppercase">
          Testimonials
        </span>
      </div>

      <div className="text-center max-w-xl mx-auto mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--orange)]" />
          <h2 className="font-serif-display text-3xl md:text-4xl leading-tight">
            Testimonials That
            <br /> Speak to{' '}
            <span className="text-[var(--orange)] italic">My Results</span>
          </h2>
          <Send className="w-5 h-5 text-[var(--orange)]" />
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          Trusted by businesses and teams who wanted sharper campaigns, better
          messaging, and stronger marketing outcomes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {visible.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="bg-[var(--testimonial-bg)] rounded-2xl p-5 border border-white/5 tilt-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={mediaUrl(t.avatar)}
                alt={t.name}
                width="40"
                height="40"
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-white/50">{t.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-3.5 h-3.5 fill-[var(--orange)] text-[var(--orange)]"
                />
              ))}
              <span className="ml-1 text-xs text-white/70">5.0</span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              {t.quote}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Testimonial ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i
                ? 'bg-[var(--orange)] w-8'
                : 'bg-white/20 w-2 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
