import { Check, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ctaFeatures, ctaServices } from '../mock';
import { trackCtaClick } from '../lib/analytics';

export default function CtaBanner() {
  return (
    <section
      id="results"
      className="px-4 md:px-10 lg:px-16 py-10 max-w-[1400px] mx-auto"
    >
      <div className="reveal text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
            07
          </span>
          <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
            Project Idea CTA
          </span>
        </div>
        <h2 className="font-serif-display text-3xl md:text-5xl leading-tight max-w-3xl mx-auto">
          Have a Project in Mind?{' '}
          <span className="text-[var(--orange)] italic">Let&apos;s Build It Together.</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8">
          {ctaFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--orange)] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
              <span className="text-sm text-[var(--text-secondary)]">{f}</span>
            </div>
          ))}
        </div>

        <Link
          to="/contact"
          onClick={() => trackCtaClick('Start a project', 'cta_banner')}
          className="group mt-8 inline-flex items-center gap-2 bg-[var(--dark-bg)] text-white rounded-full pl-6 pr-2 py-2 font-medium transition-colors duration-300 hover:bg-[var(--orange)]"
        >
          Start a project
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--orange)] text-white group-hover:bg-white group-hover:text-[var(--orange)] group-hover:rotate-45 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </Link>
      </div>

      {/* Marquee */}
      <div className="reveal mt-10 overflow-hidden rounded-2xl bg-[var(--orange)] py-5">
        <div className="marquee-track gap-12">
          {Array.from({ length: 4 }).map((_, copy) => (
            <div key={copy} className="flex items-center gap-12 pr-12">
              {ctaServices.map((s) => (
                <div
                  key={`${copy}-${s}`}
                  className="flex items-center gap-12 text-white font-serif-display text-2xl md:text-3xl whitespace-nowrap"
                >
                  {s}
                  <span className="text-white/80 text-3xl">+</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
