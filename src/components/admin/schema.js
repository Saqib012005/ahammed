// ---------------------------------------------------------------------------
// Field schemas that drive the admin dashboard forms.
//
// Each content type maps to an ordered list of fields. The generic
// ContentManager renders a form from this schema and shows a compact list row
// using the `primary`/`secondary`/`thumb` hints. Keeping the shapes here means
// the four editors share one implementation and stay in sync with the PHP
// normalize_item() logic in api/content.php.
// ---------------------------------------------------------------------------

// Supported field kinds:
//   text      single-line input
//   textarea  multi-line input
//   paragraphs multi-line input split into an array on blank lines (blog body)
//   tags      comma-separated input stored as an array
//   date      yyyy-mm-dd date input
//   number    numeric input (min/max)
//   boolean   toggle
//   color     color picker with hex text
//   image     upload widget storing a media reference

export const TYPES = [
  { type: 'blogs', label: 'Blogs', singular: 'Blog Post' },
  { type: 'projects', label: 'Projects', singular: 'Project' },
  { type: 'services', label: 'Services', singular: 'Service' },
  { type: 'testimonials', label: 'Testimonials', singular: 'Testimonial' },
];

export const SCHEMAS = {
  blogs: {
    // How to render each item in the list view.
    list: { primary: 'title', secondary: 'category', thumb: 'image', badge: 'published' },
    fields: [
      { name: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'How to Build a Landing Page That Converts' },
      { name: 'category', label: 'Category', kind: 'text', placeholder: 'Landing Pages' },
      { name: 'author', label: 'Author', kind: 'text', placeholder: 'John' },
      { name: 'date', label: 'Date', kind: 'date' },
      { name: 'readTime', label: 'Read time', kind: 'text', placeholder: 'Auto (e.g. 6 min read)', hint: 'Leave blank to auto-estimate from the content.' },
      { name: 'published', label: 'Published', kind: 'boolean', default: true, hint: 'Unpublished posts are hidden from the public site.' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea', placeholder: 'A short summary shown on the blog list.' },
      { name: 'image', label: 'Cover image', kind: 'image' },
      { name: 'bg', label: 'Accent colour', kind: 'color', default: '#FF7A1A' },
      { name: 'content', label: 'Content', kind: 'paragraphs', required: true, hint: 'Separate paragraphs with a blank line.' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'Auto from title', hint: 'URL path. Leave blank to generate from the title.' },
    ],
  },

  projects: {
    list: { primary: 'title', secondary: 'tags', thumb: 'image' },
    fields: [
      { name: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'DG Stream – Lead Generation Campaign' },
      { name: 'image', label: 'Image', kind: 'image' },
      { name: 'description', label: 'Description', kind: 'textarea', required: true },
      { name: 'tags', label: 'Tags', kind: 'tags', placeholder: 'Meta Ads, Lead Generation, Landing Page', hint: 'Comma-separated.' },
    ],
  },

  services: {
    list: { primary: 'title', secondary: 'description', thumb: 'image' },
    fields: [
      { name: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'Landing Page' },
      { name: 'image', label: 'Image', kind: 'image' },
      { name: 'description', label: 'Description', kind: 'textarea', required: true },
    ],
  },

  testimonials: {
    list: { primary: 'name', secondary: 'role', thumb: 'avatar' },
    fields: [
      { name: 'name', label: 'Name', kind: 'text', required: true, placeholder: 'Bikram' },
      { name: 'role', label: 'Role / Company', kind: 'text', placeholder: 'Marketing Manager, Ginesys' },
      { name: 'rating', label: 'Rating', kind: 'number', min: 1, max: 5, default: 5 },
      { name: 'avatar', label: 'Avatar', kind: 'image' },
      { name: 'quote', label: 'Quote', kind: 'textarea', required: true },
    ],
  },
};

// Build a blank item for a "new" form using each field's default.
export function emptyItem(type) {
  const schema = SCHEMAS[type];
  const item = {};
  schema.fields.forEach((f) => {
    if (f.default !== undefined) {
      item[f.name] = f.default;
    } else if (f.kind === 'boolean') {
      item[f.name] = false;
    } else if (f.kind === 'number') {
      item[f.name] = f.min ?? 0;
    } else if (f.kind === 'tags' || f.kind === 'paragraphs') {
      item[f.name] = [];
    } else {
      item[f.name] = '';
    }
  });
  return item;
}

// Convert a stored item into form-friendly string values (arrays -> text).
export function toFormValues(type, item) {
  const schema = SCHEMAS[type];
  const values = {};
  schema.fields.forEach((f) => {
    const v = item[f.name];
    if (f.kind === 'paragraphs') {
      values[f.name] = Array.isArray(v) ? v.join('\n\n') : v || '';
    } else if (f.kind === 'tags') {
      values[f.name] = Array.isArray(v) ? v.join(', ') : v || '';
    } else if (f.kind === 'boolean') {
      values[f.name] = v === undefined ? (f.default ?? false) : Boolean(v);
    } else if (f.kind === 'number') {
      values[f.name] = v === undefined || v === '' ? (f.default ?? '') : v;
    } else {
      values[f.name] = v === undefined || v === null ? '' : v;
    }
  });
  return values;
}

// Convert form values back into the payload shape the API expects.
export function toPayload(type, values) {
  const schema = SCHEMAS[type];
  const payload = {};
  schema.fields.forEach((f) => {
    const v = values[f.name];
    if (f.kind === 'paragraphs') {
      payload[f.name] = String(v || '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    } else if (f.kind === 'tags') {
      payload[f.name] = String(v || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (f.kind === 'boolean') {
      payload[f.name] = Boolean(v);
    } else if (f.kind === 'number') {
      payload[f.name] = Number(v) || 0;
    } else {
      payload[f.name] = String(v ?? '').trim();
    }
  });
  return payload;
}

// Validate required fields; returns an array of human-readable messages.
export function validate(type, values) {
  const schema = SCHEMAS[type];
  const errors = [];
  schema.fields.forEach((f) => {
    if (!f.required) return;
    const v = values[f.name];
    const empty =
      v === undefined ||
      v === null ||
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0);
    if (empty) errors.push(`${f.label} is required.`);
  });
  return errors;
}
