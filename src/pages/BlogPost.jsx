import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useBlogs, mediaUrl } from '../lib/content';
import { formatDate } from '../lib/format';
import { trackCtaClick } from '../lib/analytics';
import NotFound from './NotFound';

export default function BlogPost() {
  const { slug } = useParams();
  const { blogs } = useBlogs();
  const post = useMemo(() => blogs.find((p) => p.slug === slug), [blogs, slug]);
  const related = useMemo(
    () => blogs.filter((p) => p.slug !== slug).slice(0, 3),
    [blogs, slug]
  );

  if (!post) return <NotFound />;

  return (
    <article className="pt-32 pb-20">
      <div className="px-4 md:px-10 lg:px-16 max-w-[820px] mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--orange)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="font-medium bg-[var(--orange)]/10 text-[var(--orange)] px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span className="text-[var(--text-muted)]">&bull;</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="font-serif-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.02em] mt-4">
            {post.title}
          </h1>
          <p className="text-[var(--text-secondary)] mt-3">by {post.author}</p>
        </motion.div>
      </div>

      {/* Cover image */}
      <div className="px-4 md:px-10 lg:px-16 max-w-[1000px] mx-auto mt-8">
        <div
          className="relative aspect-[16/9] rounded-3xl overflow-hidden"
          style={{ backgroundColor: post.bg }}
        >
          <img
            src={mediaUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover mix-blend-overlay opacity-90"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 md:px-10 lg:px-16 max-w-[820px] mx-auto mt-10">
        <div className="space-y-6">
          {post.content.map((para, i) => (
            <p
              key={i}
              className="text-[var(--text-primary)]/90 text-lg leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Inline CTA */}
        <div className="mt-12 rounded-3xl bg-[var(--dark-bg)] text-white p-8 noise-overlay relative overflow-hidden">
          <h3 className="font-serif-display text-2xl md:text-3xl leading-tight">
            Want results like these for your business?
          </h3>
          <p className="text-white/60 text-sm mt-2 max-w-xl">
            Let&apos;s talk about how strategic marketing can generate more qualified leads for
            you.
          </p>
          <Link
            to="/contact"
            onClick={() => trackCtaClick('Get in touch', 'blog_post')}
            className="group mt-5 inline-flex items-center gap-2 bg-[var(--orange)] text-white rounded-full pl-5 pr-2 py-2 font-medium transition-transform hover:scale-105"
          >
            Get in touch
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-[var(--orange)] group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>

      {/* Related posts */}
      <div className="px-4 md:px-10 lg:px-16 max-w-[1400px] mx-auto mt-20">
        <h2 className="font-serif-display text-3xl mb-8">
          More <span className="text-[var(--orange)] italic">articles</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((r) => (
            <Link
              key={r.id}
              to={`/blog/${r.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden border border-[var(--border-c)] bg-white hover-lift"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{ backgroundColor: r.bg }}
              >
                <img
                  src={mediaUrl(r.image)}
                  alt={r.title}
                  className="w-full h-full object-cover mix-blend-overlay opacity-90 transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-[var(--orange)]">
                  {r.category}
                </span>
                <h3 className="font-serif-display text-lg mt-1 leading-snug group-hover:text-[var(--orange)] transition-colors">
                  {r.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
