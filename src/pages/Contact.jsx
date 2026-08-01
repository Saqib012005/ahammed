import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, ArrowUpRight, Send } from 'lucide-react';
import { toast } from '../components/ui/sonner';
import { contactInfo } from '../mock';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const details = [
  {
    icon: Mail,
    label: 'Email',
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s+/g, '')}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Ahammad John Mohammad',
    href: contactInfo.linkedin,
    external: true,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: contactInfo.location,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) {
      next.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email';
    }
    if (!form.message.trim()) next.message = 'Please enter a message';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // No backend wired yet — open the visitor's email client pre-filled so the
    // message reaches John reliably, and confirm with a toast.
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${encodeURIComponent(
      form.message
    )}`;
    const subject = encodeURIComponent(form.subject || `New enquiry from ${form.name}`);
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;

    toast.success('Thanks! Your email draft is ready — hit send to reach me.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const inputCls =
    'w-full rounded-2xl border border-[var(--border-c)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20';

  return (
    <section className="px-4 md:px-10 lg:px-16 pt-32 pb-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-2xl">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block w-8 h-8 rounded-md bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">
            @
          </span>
          <span className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">
            Get in touch
          </span>
        </div>
        <h1 className="font-serif-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
          Let&apos;s build something{' '}
          <span className="text-[var(--orange)] italic">that converts.</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-4 leading-relaxed">
          Have a project, a role, or a question in mind? Send a message and I&apos;ll get back
          to you within 24 hours.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mt-12">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="bg-white border border-[var(--border-c)] rounded-3xl p-6 md:p-8"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={update('name')}
                className={inputCls}
                placeholder="Your name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={update('email')}
                className={inputCls}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={update('subject')}
              className={inputCls}
              placeholder="What's this about?"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={update('message')}
              className={`${inputCls} resize-none`}
              placeholder="Tell me about your project or goals..."
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-6 inline-flex items-center gap-2 bg-[var(--dark-bg)] text-white rounded-full pl-6 pr-2 py-2 font-medium transition-colors duration-300 hover:bg-[var(--orange)] disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send Message'}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--orange)] text-white group-hover:bg-white group-hover:text-[var(--orange)] transition-colors">
              <Send className="w-4 h-4" />
            </span>
          </motion.button>
        </motion.form>

        {/* Details */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="space-y-4">
          {details.map(({ icon: Icon, label, value, href, external }) => {
            const inner = (
              <>
                <span className="w-11 h-11 shrink-0 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                    {label}
                  </span>
                  <span className="block text-[var(--text-primary)] font-medium truncate">
                    {value}
                  </span>
                </span>
              </>
            );
            const cardCls =
              'flex items-center gap-4 bg-white border border-[var(--border-c)] rounded-2xl p-4 transition-colors hover:border-[var(--orange)]';
            return href ? (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={cardCls}
              >
                {inner}
              </a>
            ) : (
              <div key={label} className={cardCls}>
                {inner}
              </div>
            );
          })}

          {/* CTA card */}
          <div className="rounded-3xl bg-[var(--dark-bg)] text-white p-6 md:p-8 noise-overlay relative overflow-hidden">
            <h3 className="font-serif-display text-2xl md:text-3xl leading-tight">
              Prefer a quick chat?
            </h3>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">
              Reach out directly and let&apos;s talk about how I can help your business grow.
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="group mt-5 inline-flex items-center gap-2 bg-[var(--orange)] text-white rounded-full pl-5 pr-2 py-2 font-medium transition-transform hover:scale-105"
            >
              Email me
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-[var(--orange)] group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
