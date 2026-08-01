import { Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerData, contactInfo } from '../mock';

const icons = { twitter: Twitter, instagram: Instagram, linkedin: Linkedin };
const socialUrls = {
  instagram: contactInfo.instagram,
  linkedin: contactInfo.linkedin,
  twitter: contactInfo.twitter,
};

// Map footer nav labels to routes / homepage sections.
const navTargets = {
  Home: { to: '/' },
  Services: { section: 'services' },
  Project: { section: 'project' },
  Blog: { to: '/blog' },
  Contact: { to: '/contact' },
};

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-white mt-10 noise-overlay relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 py-16">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
            09
          </span>
          <span className="text-white/60 text-xs tracking-widest uppercase">
            Footer Section
          </span>
        </div>

        <div className="grid md:grid-cols-[1.3fr_0.7fr_0.7fr] gap-8 md:gap-10 items-start">
          <div>
            <h2 className="font-serif-display text-4xl md:text-5xl mb-4">
              Let&apos;s Connect
            </h2>
            <div className="mb-4">
              <span className="font-bold tracking-wide text-xl text-white">
                {footerData.brand}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
              {footerData.tagline}
            </p>

            <div className="flex gap-3 mt-6">
              {footerData.social.map((s) => {
                const Icon = icons[s];
                return (
                  <a
                    key={s}
                    href={socialUrls[s]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--orange)] hover:border-[var(--orange)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[var(--orange)] font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerData.navigation.map((label) => {
                const target = navTargets[label] || { to: '/' };
                return (
                  <li key={label}>
                    {target.to ? (
                      <Link
                        to={target.to}
                        className="text-white/60 text-sm hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        state={{ scrollTo: target.section }}
                        className="text-white/60 text-sm hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--orange)] font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4 shrink-0" />
                {contactInfo.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/50">
          <div>{footerData.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
