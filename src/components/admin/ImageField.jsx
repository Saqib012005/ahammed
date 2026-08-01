// ---------------------------------------------------------------------------
// Admin image field.
//
// Accepts a file OR a pasted URL. On file select it uploads via upload.php and
// stores the returned media reference ("media.php?f=<id>") as the field value.
// A URL typed directly is stored verbatim (handy for reusing existing images).
// mediaUrl() resolves either form for the preview and the public site.
// ---------------------------------------------------------------------------

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../lib/admin';
import { mediaUrl } from '../../lib/content';

export default function ImageField({ value, onChange, label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.media || res.id || '');
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const preview = mediaUrl(value);

  return (
    <div>
      {label ? (
        <span className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</span>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
          {preview ? (
            <>
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Remove image"
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer transition-colors"

              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <ImagePlus className="w-7 h-7 text-neutral-300" />
          )}
          {uploading ? (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
          ) : null}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current && inputRef.current.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"

          >
            <ImagePlus className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
