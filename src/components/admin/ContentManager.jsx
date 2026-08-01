// ---------------------------------------------------------------------------
// Generic content manager for one collection (blogs/projects/services/…).
//
// Renders a list of existing items and a schema-driven create/edit form. All
// writes go through lib/admin.js and, on success, invalidate the matching
// React Query cache key (['content', type]) so the live public site updates
// immediately. Delete is guarded by a small inline confirmation.
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, Save, Star } from 'lucide-react';
import { list, create, update, remove, ApiError } from '../../lib/admin';
import { mediaUrl } from '../../lib/content';
import { SCHEMAS, emptyItem, toFormValues, toPayload, validate } from './schema';
import ImageField from './ImageField';

export default function ContentManager({ type, singular, onAuthError }) {
  const schema = SCHEMAS[type];
  const queryClient = useQueryClient();

  // 'list' | 'edit'
  const [mode, setMode] = useState('list');
  const [editing, setEditing] = useState(null); // the item being edited (or null for new)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'content', type],
    queryFn: () => list(type),
  });

  function handleError(err) {
    if (err instanceof ApiError && err.status === 401) {
      onAuthError && onAuthError();
      return;
    }
    toast.error(err.message || 'Something went wrong');
  }

  function startCreate() {
    setEditing(null);
    setMode('edit');
  }

  function startEdit(item) {
    setEditing(item);
    setMode('edit');
  }

  async function afterWrite() {
    // Refresh the admin list and the public site caches.
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['content', type] });
    setMode('list');
    setEditing(null);
  }

  if (mode === 'edit') {
    return (
      <ItemForm
        type={type}
        singular={singular}
        item={editing}
        onCancel={() => {
          setMode('list');
          setEditing(null);
        }}
        onSaved={afterWrite}
        onError={handleError}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">{schema.label || type}</h2>
          <p className="text-sm text-neutral-500">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" /> New {singular}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-neutral-500 py-12 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading…
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-3">Could not load {type}.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 rounded-xl">
          <p className="text-neutral-500 mb-4">No {type} yet.</p>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" /> Create the first one
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <ListRow
              key={item.id}
              type={type}
              item={item}
              onEdit={() => startEdit(item)}
              onDeleted={afterWrite}
              onError={handleError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// --- one row in the list ---------------------------------------------------
function ListRow({ type, item, onEdit, onDeleted, onError }) {
  const cfg = SCHEMAS[type].list;
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const primary = item[cfg.primary] || '(untitled)';
  let secondary = item[cfg.secondary];
  if (Array.isArray(secondary)) secondary = secondary.join(', ');
  const thumb = cfg.thumb ? mediaUrl(item[cfg.thumb]) : '';
  const unpublished = cfg.badge && item[cfg.badge] === false;

  async function doDelete() {
    setDeleting(true);
    try {
      await remove(type, item.id);
      toast.success('Deleted');
      await onDeleted();
    } catch (err) {
      onError(err);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <li className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3 hover:border-neutral-300">
      {cfg.thumb ? (
        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
          {thumb ? (
            <img src={thumb} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
      ) : null}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-neutral-900 truncate">{primary}</p>
          {unpublished ? (
            <span className="shrink-0 rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
              Draft
            </span>
          ) : null}
        </div>
        {secondary ? (
          <p className="text-sm text-neutral-500 truncate">{secondary}</p>
        ) : null}
      </div>

      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 hidden sm:inline">Delete?</span>
          <button
            type="button"
            onClick={doDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Yes'}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            No
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Delete"
            className="p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
}

// --- create/edit form ------------------------------------------------------
function ItemForm({ type, singular, item, onCancel, onSaved, onError }) {
  const schema = SCHEMAS[type];
  const isNew = !item;
  const initial = useMemo(
    () => (isNew ? toFormValues(type, emptyItem(type)) : toFormValues(type, item)),
    [type, item, isNew]
  );
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(type, values);
    setErrors(errs);
    if (errs.length) {
      toast.error(errs[0]);
      return;
    }
    const payload = toPayload(type, values);
    if (!isNew) payload.id = item.id;

    setSaving(true);
    try {
      if (isNew) {
        await create(type, payload);
        toast.success(`${singular} created`);
      } else {
        await update(type, payload);
        toast.success(`${singular} updated`);
      }
      await onSaved();
    } catch (err) {
      onError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? `Create ${singular}` : 'Save changes'}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-neutral-900 mb-5">
        {isNew ? `New ${singular}` : `Edit ${singular}`}
      </h2>

      {errors.length ? (
        <ul className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 list-disc list-inside">
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      ) : null}

      <div className="space-y-5">
        {schema.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(v) => setField(field.name, v)}
          />
        ))}
      </div>
    </form>
  );
}

// --- one field -------------------------------------------------------------
function Field({ field, value, onChange }) {
  const labelEl = (
    <label htmlFor={field.name} className="block text-sm font-medium text-neutral-700 mb-1.5">
      {field.label}
      {field.required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
  const hint = field.hint ? (
    <p className="mt-1 text-xs text-neutral-400">{field.hint}</p>
  ) : null;
  const inputCls =
    'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';

  switch (field.kind) {
    case 'image':
      return (
        <div>
          <ImageField label={field.label} value={value} onChange={onChange} />
          {hint}
        </div>
      );

    case 'boolean':
      return (
        <div>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <span className="relative">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
              />
              <span className="block w-11 h-6 rounded-full bg-neutral-300 peer-checked:bg-orange-500 transition-colors" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="text-sm font-medium text-neutral-700">{field.label}</span>
          </label>
          {hint}
        </div>
      );

    case 'textarea':
      return (
        <div>
          {labelEl}
          <textarea
            id={field.name}
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
          {hint}
        </div>
      );

    case 'paragraphs':
      return (
        <div>
          {labelEl}
          <textarea
            id={field.name}
            rows={12}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${inputCls} font-mono leading-relaxed`}
          />
          {hint}
        </div>
      );

    case 'date':
      return (
        <div>
          {labelEl}
          <input
            id={field.name}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
          {hint}
        </div>
      );

    case 'number':
      return (
        <div>
          {labelEl}
          {field.min === 1 && field.max === 5 ? (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      n <= Number(value) ? 'fill-orange-400 text-orange-400' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-neutral-500">{Number(value) || 0} / 5</span>
            </div>
          ) : (
            <input
              id={field.name}
              type="number"
              min={field.min}
              max={field.max}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              className={inputCls}
            />
          )}
          {hint}
        </div>
      );

    case 'color':
      return (
        <div>
          {labelEl}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || '#FF7A1A'}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-14 rounded border border-neutral-300 bg-white p-1 cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#FF7A1A"
              className={`${inputCls} max-w-[140px] font-mono`}
            />
          </div>
          {hint}
        </div>
      );

    default:
      return (
        <div>
          {labelEl}
          <input
            id={field.name}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
          {hint}
        </div>
      );
  }
}
