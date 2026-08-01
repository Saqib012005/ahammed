<?php
// ---------------------------------------------------------------------------
// /api/content.php?type=blogs|projects|services|testimonials
//
//   GET                       public list (blogs: only published unless authed)
//   POST   (auth) {item}      create a new item, returns it with a new id
//   PUT    (auth) {item}      update the item whose id matches, returns it
//   DELETE (auth) ?id=123     delete the item with that id
//
// Writes require a valid Bearer token from login.php.
// ---------------------------------------------------------------------------

require __DIR__ . '/lib.php';
send_cors_headers();

$type = $_GET['type'] ?? '';
if (!in_array($type, $GLOBALS['CONTENT_TYPES'], true)) {
    json_error('Unknown or missing content type', 400);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        handle_get($type);
        break;
    case 'POST':
        require_auth();
        handle_create($type);
        break;
    case 'PUT':
        require_auth();
        handle_update($type);
        break;
    case 'DELETE':
        require_auth();
        handle_delete($type);
        break;
    default:
        json_error('Method not allowed', 405);
}

// ---------------------------------------------------------------------------
function handle_get(string $type): void
{
    $items = read_collection($type);

    // Blogs: hide unpublished posts from the public. An authenticated admin
    // (valid token) receives everything so drafts show in the dashboard.
    if ($type === 'blogs') {
        $auth = load_auth();
        $isAdmin = $auth !== null && verify_token($auth['secret']);
        if (!$isAdmin) {
            $items = array_values(array_filter($items, static function ($p) {
                return !isset($p['published']) || $p['published'] === true;
            }));
        }
    }

    json_response($items);
}

function handle_create(string $type): void
{
    $items = read_collection($type);
    $input = read_json_body();
    $item = normalize_item($type, $input, null, $items);
    $item['id'] = next_id($items);
    if ($type === 'blogs') {
        $item['slug'] = unique_slug($items, $item['slug'], null);
    }
    $items[] = $item;
    write_collection($type, $items);
    json_response($item, 201);
}

function handle_update(string $type): void
{
    $items = read_collection($type);
    $input = read_json_body();
    $id = $input['id'] ?? ($_GET['id'] ?? null);
    if ($id === null) {
        json_error('Missing id', 400);
    }

    $found = false;
    foreach ($items as $idx => $existing) {
        if ((string) ($existing['id'] ?? '') === (string) $id) {
            $merged = normalize_item($type, $input, $existing, $items);
            $merged['id'] = $existing['id'];
            if ($type === 'blogs') {
                $merged['slug'] = unique_slug($items, $merged['slug'], $existing['id']);
            }
            $items[$idx] = $merged;
            $found = true;
            $result = $merged;
            break;
        }
    }
    if (!$found) {
        json_error('Item not found', 404);
    }
    write_collection($type, $items);
    json_response($result);
}

function handle_delete(string $type): void
{
    $id = $_GET['id'] ?? null;
    if ($id === null) {
        $body = read_json_body();
        $id = $body['id'] ?? null;
    }
    if ($id === null) {
        json_error('Missing id', 400);
    }

    $items = read_collection($type);
    $before = count($items);
    $items = array_values(array_filter($items, static function ($item) use ($id) {
        return (string) ($item['id'] ?? '') !== (string) $id;
    }));
    if (count($items) === $before) {
        json_error('Item not found', 404);
    }
    write_collection($type, $items);
    json_response(['ok' => true]);
}

// ---------------------------------------------------------------------------
// Build a clean, type-specific record from client input, merged over any
// existing record (so PUT can send partial fields). Never trusts client ids.
function normalize_item(string $type, array $in, ?array $existing, array $all): array
{
    $existing = $existing ?? [];
    $str = static function ($key, $default = '') use ($in, $existing) {
        if (array_key_exists($key, $in)) {
            return is_string($in[$key]) ? trim($in[$key]) : $in[$key];
        }
        return $existing[$key] ?? $default;
    };

    switch ($type) {
        case 'blogs':
            $title = (string) $str('title', 'Untitled');
            // content may arrive as an array of paragraphs or a blob of text.
            if (array_key_exists('content', $in)) {
                $content = normalize_paragraphs($in['content']);
            } else {
                $content = $existing['content'] ?? [];
            }
            $slug = (string) $str('slug', '');
            if ($slug === '') {
                $slug = slugify($title);
            } else {
                $slug = slugify($slug);
            }
            $published = array_key_exists('published', $in)
                ? (bool) $in['published']
                : ($existing['published'] ?? true);
            return [
                'slug'      => $slug,
                'category'  => (string) $str('category', 'General'),
                'author'    => (string) $str('author', 'John'),
                'date'      => normalize_date($str('date', '')),
                'readTime'  => (string) $str('readTime', estimate_read_time($content)),
                'published' => $published,
                'excerpt'   => (string) $str('excerpt', ''),
                'title'     => $title,
                'image'     => (string) $str('image', ''),
                'bg'        => (string) $str('bg', '#FF7A1A'),
                'content'   => $content,
            ];

        case 'projects':
            return [
                'title'       => (string) $str('title', 'Untitled'),
                'image'       => (string) $str('image', ''),
                'description' => (string) $str('description', ''),
                'tags'        => normalize_tags(array_key_exists('tags', $in) ? $in['tags'] : ($existing['tags'] ?? [])),
            ];

        case 'services':
            return [
                'title'       => (string) $str('title', 'Untitled'),
                'image'       => (string) $str('image', ''),
                'description' => (string) $str('description', ''),
            ];

        case 'testimonials':
            $rating = array_key_exists('rating', $in) ? (int) $in['rating'] : (int) ($existing['rating'] ?? 5);
            $rating = max(1, min(5, $rating));
            return [
                'name'   => (string) $str('name', ''),
                'role'   => (string) $str('role', ''),
                'rating' => $rating,
                'avatar' => (string) $str('avatar', ''),
                'quote'  => (string) $str('quote', ''),
            ];
    }

    return $in;
}

// Accept an array of paragraphs, or a string with blank-line/newline breaks.
function normalize_paragraphs($value): array
{
    if (is_array($value)) {
        $out = [];
        foreach ($value as $p) {
            $p = trim((string) $p);
            if ($p !== '') {
                $out[] = $p;
            }
        }
        return $out;
    }
    $text = (string) $value;
    $parts = preg_split('/\n\s*\n|\r\n\s*\r\n/', trim($text));
    if ($parts === false) {
        $parts = [trim($text)];
    }
    return array_values(array_filter(array_map('trim', $parts), static function ($p) {
        return $p !== '';
    }));
}

// Accept an array of tags or a comma-separated string.
function normalize_tags($value): array
{
    if (!is_array($value)) {
        $value = explode(',', (string) $value);
    }
    $out = [];
    foreach ($value as $t) {
        $t = trim((string) $t);
        if ($t !== '') {
            $out[] = $t;
        }
    }
    return $out;
}

// Return an ISO yyyy-mm-dd date; fall back to today when missing/invalid.
function normalize_date($value): string
{
    $value = trim((string) $value);
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return $value;
    }
    $ts = $value !== '' ? strtotime($value) : false;
    return date('Y-m-d', $ts !== false ? $ts : time());
}

// Rough "N min read" estimate at ~200 words/min.
function estimate_read_time(array $paragraphs): string
{
    $words = 0;
    foreach ($paragraphs as $p) {
        $words += str_word_count((string) $p);
    }
    $minutes = max(1, (int) ceil($words / 200));
    return $minutes . ' min read';
}
