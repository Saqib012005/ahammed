// ---------------------------------------------------------------------------
// Google Analytics 4 (GA4) helper.
//
// The GA4 tag (gtag.js) is loaded and configured ONCE in public/index.html with
// `send_page_view: false`. This module therefore only *sends* events — it never
// initializes GA4 and never references the Measurement ID, so there is a single
// source of truth (the HTML tag) and no chance of duplicate initialization.
//
// Every helper is a safe no-op when gtag is unavailable (ad-blockers, offline,
// tests, pre-hydration), so callers never need to guard themselves.
//
// PostHog is a separate analytics tool, initialized independently in
// index.html. Nothing here reads, writes, or interferes with it.
//
// PRIVACY: never pass personal data (names, email addresses, phone numbers,
// message contents, tokens) into these helpers. Parameters are limited to
// non-identifying context — labels, section locations, public profile URLs and
// page paths. Contact details (mailto:/tel:) are tracked by *location*, never
// by the address/number they contain.
// ---------------------------------------------------------------------------

/**
 * Low-level wrapper around window.gtag. No-op if GA4 isn't present.
 * @param {string} name GA4 event name (snake_case).
 * @param {Record<string, unknown>} [params] Event parameters (no PII).
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

// Remembers the last path we sent a page_view for, so a duplicate call for the
// same path (e.g. React StrictMode double-invoking effects in development, or an
// unrelated re-render) does not produce a second page_view event.
let lastPageViewPath;

/**
 * Send a GA4 page_view. Called on initial load and on every client-side route
 * change. Because the tag is configured with `send_page_view: false`, this is
 * the ONLY source of page_view events — there is no automatic one to duplicate.
 * @param {{ path?: string, title?: string }} [opts]
 */
export function trackPageView({ path, title } = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const resolvedPath =
    path ?? window.location.pathname + window.location.search;
  if (resolvedPath === lastPageViewPath) return; // de-dupe repeated calls
  lastPageViewPath = resolvedPath;
  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}

// --- Named, high-value interactions -----------------------------------------

/**
 * Primary call-to-action button/link (e.g. "Hire Me", "Start a project").
 * @param {string} ctaName Human-readable label of the CTA.
 * @param {string} location Where the CTA lives ('hero', 'cta_banner', ...).
 */
export function trackCtaClick(ctaName, location) {
  trackEvent('cta_click', { cta_name: ctaName, cta_location: location });
}

/**
 * Contact form submitted (after client-side validation passes).
 * Never includes the form's contents.
 * @param {Record<string, unknown>} [params] Non-identifying extras only.
 */
export function trackContactFormSubmit(params = {}) {
  trackEvent('contact_form_submit', { form_name: 'contact', ...params });
}

/**
 * Click on a mailto: link. The address is intentionally omitted (it is PII);
 * only the on-page location is recorded.
 * @param {string} location
 */
export function trackEmailClick(location) {
  trackEvent('email_click', { link_location: location });
}

/**
 * Click on a tel: link. The number is intentionally omitted; only the on-page
 * location is recorded.
 * @param {string} location
 */
export function trackPhoneClick(location) {
  trackEvent('phone_click', { link_location: location });
}

/**
 * Click on a social / professional profile link. Public profile URLs are safe
 * to record.
 * @param {string} network 'linkedin' | 'instagram' | 'twitter' | ...
 * @param {string} url Public profile URL.
 * @param {string} location Where the link lives ('footer', 'contact_page').
 */
export function trackSocialClick(network, url, location) {
  trackEvent('social_click', {
    social_network: network,
    link_url: url,
    link_location: location,
  });
}

/**
 * Interaction with a service card (interest in a specific service).
 * @param {string} serviceName
 */
export function trackServiceClick(serviceName) {
  trackEvent('service_click', { service_name: serviceName });
}

/**
 * Interaction with a portfolio project (interest in a specific case study).
 * @param {string} projectName
 */
export function trackProjectClick(projectName) {
  trackEvent('project_click', { project_name: projectName });
}
