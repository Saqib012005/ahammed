// ---------------------------------------------------------------------------
// Admin dashboard shell.
//
// Sidebar of the four content types + a header with a logout button. The body
// renders the generic ContentManager for the active type. A 401 from any write
// bubbles up via onAuthError so we can log the user out and show the login.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { LogOut, FileText, FolderKanban, Wrench, Quote, ExternalLink } from 'lucide-react';
import { TYPES } from './schema';
import ContentManager from './ContentManager';

const ICONS = {
  blogs: FileText,
  projects: FolderKanban,
  services: Wrench,
  testimonials: Quote,
};

export default function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState(TYPES[0].type);
  const activeMeta = TYPES.find((t) => t.type === active) || TYPES[0];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </span>
            <span className="font-semibold">Content Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View site
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors"
            >

              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar / tabs */}
        <nav className="md:w-56 shrink-0">
          <ul className="flex md:flex-col gap-1 overflow-x-auto">
            {TYPES.map((t) => {
              const Icon = ICONS[t.type] || FileText;
              const isActive = t.type === active;
              return (
                <li key={t.type}>
                  <button
                    type="button"
                    onClick={() => setActive(t.type)}
                    className={`w-full inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-neutral-600 hover:bg-neutral-200/60'
                    }`}

                  >
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Body */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-neutral-200 p-5 md:p-6">
          <ContentManager
            key={active}
            type={active}
            singular={activeMeta.singular}
            onAuthError={onLogout}
          />
        </main>
      </div>
    </div>
  );
}
