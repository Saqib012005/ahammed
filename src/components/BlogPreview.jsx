import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs, mediaUrl } from '../lib/content';

// Homepage teaser: shows the three most recent posts and links to the full /blog page.
export default function BlogPreview() {
  const { blogs } = useBlogs();
  const posts = blogs.slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="blog"
      className="px-4 md:px-10 lg:px-16 py-16 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
              08
            </span>
            <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
              Blog Section
            </span>
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl leading-tight mt-1">
            Insights &
            <br /> <span className="text-[var(--orange)] italic">Strategy</span>
          </h2>
        </div>
        <Link
          to="/blog"
          className="self-start md:self-auto inline-flex items-center gap-2 border border-[var(--border-c)] rounded-full px-5 py-2 font-medium hover:bg-[var(--dark-bg)] hover:text-white transition-colors"
        >
          See all
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <Link
            to={`/blog/${post.slug}`}
            key={post.id}
            className="reveal group relative rounded-3xl overflow-hidden hover-lift block"
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <div
              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
              style={{ backgroundColor: post.bg }}
            >
              <img
                src={mediaUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover mix-blend-overlay opacity-90 transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white text-[var(--dark-bg)] flex items-center justify-center group-hover:bg-[var(--orange)] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shadow-lg">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>

            <div className="pt-5">
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  {post.category}
                </span>
                <span className="text-[var(--text-muted)]">by {post.author}</span>
              </div>
              <h3 className="font-serif-display text-xl mt-2 leading-snug group-hover:text-[var(--orange)] transition-colors">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
