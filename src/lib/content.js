// ---------------------------------------------------------------------------
// Runtime content layer.
//
// The site fetches Blogs / Projects / Services / Testimonials from the PHP API
// at runtime so the client can edit content without a rebuild. If the API is
// unreachable (e.g. local dev without PHP, or a first deploy before the API is
// live) we fall back to the bundled mock data so the site always renders.
// ---------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';
import {
  services as mockServices,
  portfolio as mockPortfolio,
  testimonials as mockTestimonials,
  blogPosts as mockBlogPosts,
} from '../mock';

// Base URL of the API. Defaults to a same-origin "/api" (how it is deployed on
// Hostinger). Override with REACT_APP_API_BASE for local dev / other hosts.
export const API_BASE = (process.env.REACT_APP_API_BASE || '/api').replace(/\/+$/, '');

// Turn a stored image value into a usable src.
//  - Absolute URLs (https://…, data:) are returned unchanged (e.g. seed images).
//  - Values produced by upload.php ("media.php?f=<id>") are resolved against the
//    API base so they load from wherever the API lives.
//  - Empty values return '' so <img> can decide what to do.
export function mediaUrl(value) {
  if (!value) return '';
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }
  const path = value.replace(/^\/+/, '');
  return `${API_BASE}/${path}`;
}

// Fetch one content collection. Throws on any non-OK response so React Query
// can surface the error and we can fall back to mock data.
async function fetchCollection(type) {
  const res = await fetch(`${API_BASE}/content.php?type=${encodeURIComponent(type)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to load ${type} (${res.status})`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected response for ${type}`);
  }
  return data;
}

// Shared query options: try the API, fall back to mock on failure, and keep the
// mock as placeholder so the UI never flashes empty on first paint.
function collectionQuery(type, fallback) {
  return {
    queryKey: ['content', type],
    queryFn: async () => {
      try {
        return await fetchCollection(type);
      } catch (err) {
        // API unavailable — use the bundled content so the site still renders.
        return fallback;
      }
    },
    placeholderData: fallback,
    staleTime: 60_000,
    retry: 1,
  };
}

export function useServices() {
  const { data, ...rest } = useQuery(collectionQuery('services', mockServices));
  return { services: data ?? mockServices, ...rest };
}

export function useProjects() {
  const { data, ...rest } = useQuery(collectionQuery('projects', mockPortfolio));
  return { projects: data ?? mockPortfolio, ...rest };
}

export function useTestimonials() {
  const { data, ...rest } = useQuery(collectionQuery('testimonials', mockTestimonials));
  return { testimonials: data ?? mockTestimonials, ...rest };
}

export function useBlogs() {
  const { data, ...rest } = useQuery(collectionQuery('blogs', mockBlogPosts));
  return { blogs: data ?? mockBlogPosts, ...rest };
}
