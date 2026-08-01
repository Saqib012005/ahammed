import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlogs, mediaUrl } from '../lib/content';
import { formatDate } from '../lib/format';

const PER_PAGE = 6;

export default function BlogPage() {
  const { blogs } = useBlogs();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  // Categories are derived from the live posts so admin-added categories show up automatically.
  const blogCategories = useMemo(() => {
    const seen = [];
    for (const post of blogs) {
      if (post.category && !seen.includes(post.category)) seen.push(post.category);
    }
    return ['All', ...seen];
  }, [blogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((post) => {
      const matchesCategory = category === 'All' || post.category === category;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [blogs, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const onCategory = (c) => {
    setCategory(c);
    setPage(1);
  };
  const onQuery = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="px-4 md:px-10 lg:px-16 pt-32 pb-20 max-w-[1400px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
            ✎
          </span>
          <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
            The Blog
          </span>
        </div>
        <h1 className="font-serif-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
          Insights on marketing{' '}
          <span className="text-[var(--orange)] italic">that drives growth.</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-4 leading-relaxed">
          Practical strategies on landing pages, paid ads, copywriting, and lead generation —
          written to help you convert more visitors into customers.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-10">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((c) => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                category === c
                  ? 'bg-[var(--orange)] text-white border-[var(--orange)]'
                  : 'bg-white text-[var(--text-secondary)] border-[var(--border-c)] hover:border-[var(--orange)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative lg:w-72 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="search"
            value={query}
            onChange={onQuery}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-full border border-[var(--border-c)] bg-white pl-11 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20"
          />
        </div>
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {visible.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-3xl overflow-hidden border border-[var(--border-c)] bg-white hover-lift"
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden"
                  style={{ backgroundColor: post.bg }}
                >
                  <img
                    src={mediaUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover mix-blend-overlay opacity-90 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-4 left-4 text-xs font-medium bg-white/90 text-[var(--dark-bg)] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    <span>{formatDate(post.date)}</span>
                    <span className="text-[var(--text-muted)]">&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif-display text-xl mt-2 leading-snug group-hover:text-[var(--orange)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--orange)]">
                    Read article
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif-display text-2xl">No articles found</p>
          <p className="text-[var(--text-secondary)] mt-2">
            Try a different search or category.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="w-10 h-10 rounded-full border border-[var(--border-c)] bg-white flex items-center justify-center disabled:opacity-40 hover:border-[var(--orange)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-label={`Page ${n}`}
                aria-current={currentPage === n ? 'page' : undefined}
                className={`w-10 h-10 rounded-full text-sm font-medium border transition-colors ${
                  currentPage === n
                    ? 'bg-[var(--orange)] text-white border-[var(--orange)]'
                    : 'bg-white text-[var(--text-secondary)] border-[var(--border-c)] hover:border-[var(--orange)]'
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="w-10 h-10 rounded-full border border-[var(--border-c)] bg-white flex items-center justify-center disabled:opacity-40 hover:border-[var(--orange)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
