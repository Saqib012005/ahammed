import profileImage from './profile.png';

// Mock data for JOREA Portfolio

// Top-level navigation. `to` = a route (page), `id` = an on-home-page section anchor.
export const navLinks = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'services', label: 'Services' },
  { id: 'project', label: 'Project' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export const heroData = {
  greeting: 'Hello',
  name: 'John',
  role: 'Digital Marketing Specialist',
  description:
    '3+ Years of Experience in Digital Marketing and Social Media Marketing',
  experience: '3+ Years',
  experienceLabel: 'Experience',
  rating: 5,
  portrait: profileImage,
};

export const services = [
  {
    id: 1,
    title: 'Landing Page',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=85',
    description:
      'Landing Page Design & Conversion Optimization — Create high-converting landing pages designed to generate leads, increase conversions, and maximize your marketing ROI with seamless Google Ads and Meta Ads integration.',
  },
  {
    id: 2,
    title: 'Sales Page',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
    description:
      'Sales Page Copywriting That Converts — Persuasive sales page copywriting focused on turning visitors into paying customers and improving revenue.',
  },
  {
    id: 3,
    title: 'Copywriting',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=85',
    description:
      'Copywriting for Brands & Businesses — Professional copywriting services for websites, landing pages, advertisements, emails, product descriptions, and social media campaigns.',
  },
  {
    id: 4,
    title: 'Content Creation',
    image:
      'https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?auto=format&fit=crop&w=1600&q=85',
    description:
      'Content Creation for Social Media & Brands — Strategic content creation that helps businesses build authority, increase brand awareness, and engage their target audience.',
  },
  {
    id: 5,
    title: 'Google & Meta Ads',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=85',
    description:
      'Google & Meta Ads Management — Performance-driven Google Ads and Meta Ads management focused on generating qualified leads, increasing sales, and maximizing return on ad spend (ROAS).',
  },
  {
    id: 6,
    title: 'LinkedIn & Twitter Ads',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
    description:
      'LinkedIn & Twitter (X) Advertising — Reach decision-makers and high-value audiences through strategic LinkedIn Ads and Twitter (X) Ads campaigns.',
  },
  {
    id: 7,
    title: 'Funnel Building & Customer Acquisition Systems',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85',
    description:
      'Build complete marketing funnels that guide your audience from the first click to the final conversion and improve customer journeys.',
  },
];

export const workExperience = [
  {
    id: 1,
    company: 'Ginesys, Bengaluru',
    role: 'Digital Marketing Specialist',
    duration: 'April 2024 - Now',
    title: 'Digital Marketing Specialist',
    description:
      'Driving performance marketing, content strategy, and brand campaigns to generate qualified leads and accelerate business growth.',
  },
  {
    id: 2,
    company: 'Martha’s Cleaning Services, Virginia [Remote]',
    role: 'Social Media Marketing Specialist',
    duration: 'Jan 2024 to March 2024',
    title: 'Social Media Marketing Specialist',
    description:
      'Built social media strategies and engaging content that strengthened brand presence and increased customer engagement.',
  },
  {
    id: 3,
    company: 'Portea Medical, Bengaluru',
    role: 'Digital Marketing Intern',
    duration: 'April 2023 to November 2023',
    title: 'Digital Marketing Intern',
    description:
      'Supported SEO, content marketing, and digital campaigns while gaining hands-on experience in healthcare marketing.',
  },
];

export const whyHireMe = {
  description:
    'I don’t just create marketing campaigns—I build strategies that generate leads, improve conversions, and help businesses grow. By combining performance marketing, persuasive copywriting, and data-driven optimization, I create marketing systems that deliver measurable business results.',
  stats: [
    { value: '100+', label: 'Projects Completed' },
    { value: '8+', label: 'Happy Customers' },
  ],
  portrait: profileImage,
};

export const portfolio = [
  {
    id: 1,
    title: 'DG Stream – Lead Generation Campaign',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=85',
    description:
      'Executed a performance-driven lead generation campaign using Meta Ads and optimized landing pages, generating 8 qualified leads with just ₹2,000 in ad spend through strategic audience targeting and conversion optimization.',
    tags: ['Meta Ads', 'Lead Generation', 'Landing Page', 'Performance Marketing'],
  },
  {
    id: 2,
    title: 'Ginesys – Multi-Channel Digital Marketing',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
    description:
      'Managed multi-channel digital marketing initiatives including YouTube Marketing, LinkedIn Marketing, Twitter Marketing, Google & Meta Ads, WhatsApp & Email Marketing Automation using Salesforce Marketing Cloud (SFMC), and video production & editing to enhance brand visibility, engagement, and lead generation.',
    tags: ['Google Ads', 'Meta Ads', 'LinkedIn Marketing', 'Twitter Marketing', 'YouTube Marketing', 'SFMC'],
  },
  {
    id: 3,
    title: 'Shine A Kids Preschool – Social Media Branding',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=85',
    description:
      'Created engaging social media campaigns, event creatives, and branded content that strengthened the preschool’s online presence, improved parent engagement, and increased brand awareness.',
    tags: ['Social Media', 'Content Creation', 'Branding', 'Graphic Design'],
  },
  {
    id: 4,
    title: "Martha's Cleaning Services – Meta Ads Lead Generation",
    image:
      'https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?auto=format&fit=crop&w=1600&q=85',
    description:
      'Planned and managed Meta Ads campaigns that generated 5 qualified leads while maintaining an advertising budget of $10 per day, helping increase local customer inquiries and business visibility.',
    tags: ['Meta Ads', 'Lead Generation', 'Social Media Marketing'],
  },
  {
    id: 5,
    title: 'High-Converting Landing Pages & Sales Funnels',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85',
    description:
      'Designed conversion-focused landing pages and sales funnels with persuasive copywriting and user-centric layouts to improve lead generation, increase conversions, and maximize marketing ROI.',
    tags: ['Landing Pages', 'Sales Funnels', 'Copywriting', 'CRO'],
  },
  {
    id: 6,
    title: 'Ginesys – Email Marketing Automation',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=85',
    description:
      'Built and managed Email Marketing Automation using Salesforce Marketing Cloud (SFMC) to nurture prospects, generate qualified leads, and drive product demo bookings through personalized customer journeys and automated campaigns.',
    tags: ['Email Marketing', 'SFMC', 'Marketing Automation', 'Lead Nurturing'],
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'DG Stream Team',
    role: 'DG Stream',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/31869537/pexels-photo-31869537.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote:
      'John consistently brought fresh ideas, executed campaigns with precision, and focused on results. His Meta Ads campaign generated qualified leads on a limited budget, while his strategic approach and attention to detail made him a valuable part of our marketing efforts.',
  },
  {
    id: 2,
    name: 'Principal, Shine A Kids Preschool',
    role: 'Shine A Kids Preschool',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote:
      'John understood our vision and transformed it into engaging social media content that parents genuinely connected with. His creative designs, event promotions, and branding helped strengthen our online presence and made our communication more impactful.',
  },
  {
    id: 3,
    name: 'Bikram',
    role: 'Marketing Manager, Ginesys',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1654512697978-8ec4b550b0ba?auto=format&fit=crop&w=400&q=80',
    quote:
      'John is proactive, dependable, and always willing to take ownership of new challenges. Whether it was performance marketing, marketing automation, or content campaigns, he consistently delivered high-quality work and contributed to the team’s success.',
  },
  {
    id: 4,
    name: 'Martha’s Cleaning Services',
    role: 'Virginia, USA',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1654707577020-3514bef8d538?auto=format&fit=crop&w=400&q=80',
    quote:
      'Working with John helped us reach more local customers through targeted Meta Ads. He optimized our campaigns within budget, generated quality leads, and communicated clearly throughout the entire process. We’d gladly work with him again.',
  },
];

export const ctaFeatures = [
  '100+ Projects Completed',
  '8+ Happy Customers',
  'B2B Lead Generation',
  'Conversion Optimization',
];

export const ctaServices = [
  'Landing Pages',
  'Sales Funnels',
  'Google Ads',
  'Meta Ads',
  'Copywriting',
];

// Central contact details — used by Contact page, Footer and CTAs.
export const contactInfo = {
  email: 'ahammadjohnmohammad@gmail.com',
  phone: '+91 90591 86813',
  location: 'Bengaluru, India',
  linkedin: 'https://www.linkedin.com/in/ahammadjohnmohammad/',
  instagram: 'https://www.instagram.com/100x_marketer/',
  twitter: 'https://x.com/AJ_Mohammad_AJM',
};

export const blogPosts = [
  {
    id: 1,
    slug: 'landing-page-that-converts',
    category: 'Landing Pages',
    author: 'John',
    date: '2026-06-18',
    readTime: '6 min read',
    excerpt:
      'Learn the essential elements of a high-converting landing page, from persuasive headlines and compelling CTAs to page structure and user experience.',
    title: 'How to Build a Landing Page That Converts Visitors into Customers',
    image:
      'https://images.pexels.com/photos/28494632/pexels-photo-28494632.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#7B5CFF',
    content: [
      'A landing page has one job: turn a visitor into a lead or a customer. Unlike a homepage that tries to do everything, a great landing page removes distraction and points every element toward a single action.',
      'Start with a headline that speaks to the outcome your visitor wants. It should be specific, benefit-led, and readable in under three seconds. Pair it with a sub-headline that handles the immediate "how".',
      'Your call-to-action should appear above the fold and repeat at natural decision points. Use action language ("Get my free audit") over generic labels ("Submit"), and keep the surrounding space clean so the button is impossible to miss.',
      'Finally, back your claims with proof — testimonials, results, logos, and numbers. Conversion is a game of trust, and every element on the page is either building it or leaking it.',
    ],
  },
  {
    id: 2,
    slug: 'google-ads-vs-meta-ads',
    category: 'Performance Marketing',
    author: 'John',
    date: '2026-05-30',
    readTime: '7 min read',
    excerpt:
      'Compare Google Ads and Meta Ads to understand which platform is best for your business goals, budget, and audience intent.',
    title: 'Google Ads vs. Meta Ads: Which Platform Delivers Better ROI?',
    image:
      'https://images.pexels.com/photos/30547584/pexels-photo-30547584.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#1E9E6A',
    content: [
      'Google Ads captures existing demand — people actively searching for what you sell. Meta Ads creates demand — reaching people based on interests and behaviour before they have started looking.',
      'If your product solves an urgent, searchable problem, Google usually wins on intent. If your product is visual, discovery-led, or new to the market, Meta’s targeting and creative formats often deliver a lower cost per acquisition.',
      'The smartest budgets rarely pick one. A common playbook: use Meta to build awareness and retarget warm audiences, and use Google Search to catch the high-intent traffic that awareness creates.',
      'Whichever you choose, track conversions properly. Without clean measurement, "which platform is better" is unanswerable for your specific business.',
    ],
  },
  {
    id: 3,
    slug: 'lead-generation-blueprint',
    category: 'Lead Generation',
    author: 'John',
    date: '2026-05-12',
    readTime: '8 min read',
    excerpt:
      'A step-by-step lead generation strategy using landing pages, sales funnels, compelling copywriting, and paid advertising.',
    title: 'The Lead Generation Blueprint for More Qualified Leads Online',
    image:
      'https://images.pexels.com/photos/7562087/pexels-photo-7562087.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#F1B81C',
    content: [
      'Qualified leads come from a system, not a single tactic. The blueprint has four parts: an offer, a traffic source, a capture mechanism, and a follow-up sequence.',
      'Your offer must be worth an email address. Free audits, checklists, and templates work because they deliver value before asking for the sale.',
      'Drive traffic with a mix of paid ads and organic content, then capture it on a focused landing page. Keep forms short — every extra field lowers completion.',
      'The money is in the follow-up. An automated email sequence that educates and builds trust turns cold sign-ups into booked calls.',
    ],
  },
  {
    id: 4,
    slug: 'copywriting-that-sells',
    category: 'Copywriting',
    author: 'John',
    date: '2026-04-20',
    readTime: '5 min read',
    excerpt:
      'The persuasion principles behind copy that sells — clarity, specificity, and speaking directly to your reader’s desires.',
    title: 'Copywriting That Sells: Principles Behind High-Converting Words',
    image:
      'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#FF7A1A',
    content: [
      'Great copy is not clever — it is clear. The first job of every sentence is to get the next one read.',
      'Write to one person. "You" outsells "our customers" every time because it feels like a conversation, not a broadcast.',
      'Specificity builds belief. "Generated 8 leads on a ₹2,000 budget" is more persuasive than "great results" because the reader can picture it.',
      'End with a single, obvious next step. Confused readers do not buy.',
    ],
  },
  {
    id: 5,
    slug: 'email-marketing-automation',
    category: 'Email Marketing',
    author: 'John',
    date: '2026-03-28',
    readTime: '6 min read',
    excerpt:
      'How automated email journeys nurture prospects, recover lost sales, and drive demo bookings on autopilot.',
    title: 'Email Marketing Automation: Turn Sign-Ups into Customers',
    image:
      'https://images.pexels.com/photos/4132538/pexels-photo-4132538.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#2563EB',
    content: [
      'Automation lets you have the right conversation with every lead at scale. A welcome sequence introduces your brand; a nurture sequence builds authority; a sales sequence makes the offer.',
      'Segment by behaviour, not just demographics. Someone who clicked a pricing link is a very different lead from someone who only opened a newsletter.',
      'Personalise beyond the first name — reference the resource they downloaded or the page they visited to keep messages relevant.',
      'Measure opens, clicks, and replies, then prune what underperforms. A lean, high-signal sequence beats a bloated one.',
    ],
  },
  {
    id: 6,
    slug: 'social-media-branding',
    category: 'Social Media',
    author: 'John',
    date: '2026-03-05',
    readTime: '5 min read',
    excerpt:
      'Build a brand presence on social that earns trust, grows awareness, and turns followers into a community.',
    title: 'Social Media Branding: Build a Presence People Remember',
    image:
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1600',
    bg: '#DB2777',
    content: [
      'A memorable brand is consistent. Same voice, same visual language, same values across every post — that repetition is what makes you recognisable.',
      'Lead with value, not promotion. Teach, entertain, or inspire, and the audience will give you permission to sell.',
      'Engagement is a two-way street. Reply to comments, join conversations, and treat your feed as a community, not a billboard.',
      'Track what resonates and do more of it. Your audience will tell you what your brand should be about.',
    ],
  },
];

// Categories derived for the blog filter (kept explicit for ordering control).
export const blogCategories = [
  'All',
  'Landing Pages',
  'Performance Marketing',
  'Lead Generation',
  'Copywriting',
  'Email Marketing',
  'Social Media',
];

export const footerData = {
  brand: 'Ahammad John Mohammad',
  tagline:
    'Helping businesses generate qualified leads, increase conversions, and accelerate growth through performance marketing, persuasive copywriting, conversion-focused landing pages, and data-driven digital strategies.',
  navigation: ['Home', 'Services', 'Project', 'Blog', 'Contact'],
  contact: {
    phone: '+91 90591 86813',
    email: 'ahammadjohnmohammad@gmail.com',
    location: 'Bengaluru, India',
  },
  social: ['instagram', 'linkedin', 'twitter'],
  copyright: '© 2026 Ahammad John Mohammad | All Rights Reserved',
  legal: ['Links', 'Terms & Conditions', 'Privacy Policy'],
};
