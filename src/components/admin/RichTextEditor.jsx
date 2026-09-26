import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Unlink,
  Image as ImageIcon,
  Smile,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
  Eye,
  Edit3,
  Upload,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { uploadImage } from '../../lib/admin';
import { mediaUrl } from '../../lib/content';

const EMOJI_GROUPS = [
  {
    title: 'Popular & Reactions',
    items: ['🔥', '✨', '💡', '🚀', '🎯', '📈', '💼', '✍️', '📝', '📣', '⭐', '💰', '🤝', '👍', '👏', '🙌', '🎉', '💯'],
  },
  {
    title: 'Arrows & Pointers',
    items: ['👉', '👈', '👆', '👇', '➔', '➜', '➤', '→', '←', '↑', '↓', '↔', '⇒', '►', '◄'],
  },
  {
    title: 'Bullets & Marks',
    items: ['•', '‣', '⁃', '✦', '★', '❖', '✓', '✔', '✕', '✖', '▪', '▫', '◆', '◇', '▲', '▼'],
  },
  {
    title: 'Symbols & Currency',
    items: ['®', '™', '©', '₹', '$', '€', '£', '¥', '%', '±', '≠', '≈', '•', '«', '»', '—', '–', '“', '”'],
  },
];

export default function RichTextEditor({ value = '', onChange, placeholder = 'Write your blog post here...' }) {
  const editorRef = useRef(null);
  const [mode, setMode] = useState('edit'); // 'edit' | 'source' | 'preview'
  const [sourceCode, setSourceCode] = useState(value);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
    blockquote: false,
    block: 'p',
  });

  const savedSelectionRef = useRef(null);

  // Sync initial content once or when value prop changes externally
  useEffect(() => {
    if (editorRef.current && mode === 'edit') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setSourceCode(value || '');
  }, [value, mode]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isUl = document.queryCommandState('insertUnorderedList');
      const isOl = document.queryCommandState('insertOrderedList');
      
      let block = 'p';
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        while (el && el !== editorRef.current) {
          const tag = el.tagName ? el.tagName.toLowerCase() : '';
          if (['h1', 'h2', 'h3', 'h4', 'blockquote', 'p'].includes(tag)) {
            block = tag;
            break;
          }
          el = el.parentElement;
        }
      }

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        ul: isUl,
        ol: isOl,
        blockquote: block === 'blockquote',
        block,
      });
    } catch {
      // Ignore queryCommandState failures in non-standard selections
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
      updateActiveFormats();
    }
  };

  const executeCommand = (command, val = null) => {
    if (mode !== 'edit' || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const setHeading = (tag) => {
    if (mode !== 'edit' || !editorRef.current) return;
    editorRef.current.focus();
    if (tag === 'p') {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    handleInput();
  };

  // Link Handling
  const openLinkDialog = () => {
    saveSelection();
    const sel = window.getSelection();
    let text = '';
    let existingHref = '';

    if (sel && !sel.isCollapsed) {
      text = sel.toString();
    }

    if (sel && sel.anchorNode) {
      let el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
      while (el && el !== editorRef.current) {
        if (el.tagName && el.tagName.toLowerCase() === 'a') {
          existingHref = el.getAttribute('href') || '';
          text = el.innerText || text;
          break;
        }
        el = el.parentElement;
      }
    }

    setLinkText(text);
    setLinkUrl(existingHref || 'https://');
    setShowLinkModal(true);
  };

  const insertLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;
    restoreSelection();
    editorRef.current.focus();

    if (linkText) {
      const targetAttr = linkTargetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
      const anchorHtml = `<a href="${linkUrl}" class="text-orange-500 underline font-medium hover:text-orange-600"${targetAttr}>${linkText}</a>`;
      document.execCommand('insertHTML', false, anchorHtml);
    } else {
      document.execCommand('createLink', false, linkUrl);
    }

    handleInput();
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const removeLink = () => {
    executeCommand('unlink');
  };

  // Image Handling
  const openImageDialog = () => {
    saveSelection();
    setShowImageModal(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      const fullUrl = mediaUrl(res.media);
      setImageUrl(fullUrl);
      if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
    } catch {
      // If server upload fails or running mock, fallback to data url for instant preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const insertImage = (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    restoreSelection();
    editorRef.current.focus();

    const alt = imageAlt || 'Blog illustration';
    let imgHtml = `<figure class="my-6">
      <img src="${imageUrl}" alt="${alt}" class="w-full max-h-[500px] object-cover rounded-2xl shadow-md border border-neutral-200" />`;
    if (imageCaption) {
      imgHtml += `<figcaption class="text-center text-xs text-neutral-500 mt-2 italic">${imageCaption}</figcaption>`;
    }
    imgHtml += `</figure><p><br></p>`;

    document.execCommand('insertHTML', false, imgHtml);
    handleInput();
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
  };

  // Emoji insertion
  const insertEmoji = (emoji) => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji);
      handleInput();
    }
    setShowEmojiPicker(false);
  };

  // Divider
  const insertDivider = () => {
    executeCommand('insertHorizontalRule');
  };

  // Quote
  const toggleBlockquote = () => {
    if (activeFormats.blockquote) {
      setHeading('p');
    } else {
      executeCommand('formatBlock', 'blockquote');
    }
  };

  return (
    <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400 transition-all">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-50 border-b border-neutral-200 text-neutral-700">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-600 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-600 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Heading / Style dropdown */}
        <div className="pr-1 border-r border-neutral-300">
          <select
            value={activeFormats.block}
            onChange={(e) => setHeading(e.target.value)}
            disabled={mode !== 'edit'}
            aria-label="Format Heading"
            className="text-xs font-medium py-1 px-2 rounded border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Title / H1</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
          </select>
        </div>

        {/* Inline styles */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold (Ctrl+B)"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.bold ? 'bg-orange-100 text-orange-600 font-bold' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic (Ctrl+I)"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.italic ? 'bg-orange-100 text-orange-600 italic' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline (Ctrl+U)"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.underline ? 'bg-orange-100 text-orange-600 underline' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bulleted List"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.ul ? 'bg-orange-100 text-orange-600' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.ol ? 'bg-orange-100 text-orange-600' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Blockquote & Divider */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300">
          <button
            type="button"
            onClick={toggleBlockquote}
            title="Blockquote"
            className={`p-1.5 rounded transition-colors ${
              activeFormats.blockquote ? 'bg-orange-100 text-orange-600' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertDivider}
            title="Horizontal Divider"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300">
          <button
            type="button"
            onClick={openLinkDialog}
            title="Add or Edit Link"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={removeLink}
            title="Remove Link"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 transition-colors"
          >
            <Unlink className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Emojis */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-300 relative">
          <button
            type="button"
            onClick={openImageDialog}
            title="Insert Image"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowEmojiPicker((p) => !p);
              }}
              title="Add Emojis & Symbols"
              className={`p-1.5 rounded transition-colors ${
                showEmojiPicker ? 'bg-orange-100 text-orange-600' : 'hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Emoji & Symbol Popover */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white rounded-xl shadow-2xl border border-neutral-200 p-3 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-2">
                  <span className="text-xs font-semibold text-neutral-800">Emojis & Symbols</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {EMOJI_GROUPS.map((group) => (
                  <div key={group.title} className="mb-3">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                      {group.title}
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {group.items.map((char) => (
                        <button
                          key={char}
                          type="button"
                          onClick={() => insertEmoji(char)}
                          className="h-8 w-8 flex items-center justify-center rounded hover:bg-orange-50 hover:scale-110 text-base transition-all"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View Mode Switcher: Edit / HTML Source / Live Preview */}
        <div className="ml-auto flex items-center gap-1 bg-neutral-200/70 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              if (mode === 'source') {
                onChange(sourceCode);
              }
              setMode('edit');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'edit' ? 'bg-white shadow-sm text-neutral-900 font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (mode === 'edit' && editorRef.current) {
                setSourceCode(editorRef.current.innerHTML);
              }
              setMode('source');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'source' ? 'bg-white shadow-sm text-neutral-900 font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> HTML
          </button>
          <button
            type="button"
            onClick={() => {
              if (mode === 'edit' && editorRef.current) {
                onChange(editorRef.current.innerHTML);
              } else if (mode === 'source') {
                onChange(sourceCode);
              }
              setMode('preview');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'preview' ? 'bg-orange-500 shadow-sm text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="min-h-[340px] max-h-[620px] overflow-y-auto">
        {mode === 'edit' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            data-placeholder={placeholder}
            className="p-4 outline-none prose prose-neutral max-w-none min-h-[340px] blog-editor-surface leading-relaxed text-neutral-800"
          />
        )}

        {mode === 'source' && (
          <textarea
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Edit raw HTML markup..."
            rows={14}
            className="w-full p-4 font-mono text-xs leading-relaxed text-neutral-800 bg-neutral-900 text-neutral-100 outline-none resize-y min-h-[340px]"
          />
        )}

        {mode === 'preview' && (
          <div className="p-6 bg-neutral-50/50">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Article Body Preview
              </span>
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                Live formatting preview
              </span>
            </div>
            <div
              className="blog-content rich-text-output text-neutral-800 text-base leading-relaxed space-y-4 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-neutral-400 italic">No content yet.</p>' }}
            />
          </div>
        )}
      </div>

      {/* Modal: Hyperlink */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-orange-500" /> Insert or Edit Link
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={insertLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Link URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Display Text (optional)</label>
                <input
                  type="text"
                  placeholder="Click here"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkTargetBlank}
                  onChange={(e) => setLinkTargetBlank(e.target.checked)}
                  className="rounded border-neutral-300 text-orange-500 focus:ring-orange-400"
                />
                Open link in a new tab
              </label>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 rounded-lg shadow-sm transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Image Insertion */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-500" /> Insert Image in Blog Content
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={insertImage} className="space-y-4">
              {/* Option 1: File Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Upload Image from Device
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-orange-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-neutral-50/50">
                  <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-600">
                    {uploadingImage ? 'Uploading image...' : 'Click to select an image file (PNG, JPG, WebP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Option 2: Image URL */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Or paste Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {imageUrl && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    placeholder="Descriptive text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Figure 1: Campaign metrics"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl || uploadingImage}
                  className="px-5 py-2 text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
