import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-20">
      <div className="text-center max-w-md">
        <div className="font-serif-display text-[clamp(4rem,18vw,10rem)] leading-none text-[var(--orange)]">
          404
        </div>
        <h1 className="font-serif-display text-2xl md:text-3xl mt-2">
          This page took a wrong turn.
        </h1>
        <p className="text-[var(--text-secondary)] mt-3">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 bg-[var(--dark-bg)] text-white rounded-full pl-6 pr-2 py-2 font-medium transition-colors duration-300 hover:bg-[var(--orange)]"
        >
          Back home
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--orange)] text-white group-hover:bg-white group-hover:text-[var(--orange)] group-hover:rotate-45 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
