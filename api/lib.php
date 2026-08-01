<?php
// ---------------------------------------------------------------------------
// Shared helpers: bootstrap, locked JSON storage, seeding, auth tokens, CORS.
// Every endpoint does `require __DIR__ . '/lib.php';` which also pulls config.
// ---------------------------------------------------------------------------

require_once __DIR__ . '/config.php';

// --- CORS / preflight ------------------------------------------------------
// The React app is served from the same origin in production, so CORS is not
// strictly required there. It is needed for local development where the app
// runs on :3000 and the PHP server on another port. We reflect the request
// origin (credentials are carried in the Authorization header, not cookies).
function send_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// --- JSON responses --------------------------------------------------------
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['error' => $message], $status);
}

// Read and decode a JSON request body into an associative array.
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Invalid JSON body', 400);
    }
    return $data;
}

// --- Filesystem bootstrap --------------------------------------------------
// Creates the data directories on first use and seeds the content files from
// the committed seed/ folder EXACTLY ONCE. After that the client's live data
// is authoritative and is never overwritten by a deploy or a restart.
function ensure_storage(): void
{
    foreach ([DATA_DIR, CONTENT_DIR, UPLOADS_DIR] as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }
    }

    foreach ($GLOBALS['CONTENT_TYPES'] as $type) {
        $dest = CONTENT_DIR . DIRECTORY_SEPARATOR . $type . '.json';
        if (is_file($dest)) {
            continue; // already seeded — leave the live data untouched
        }
        $seed = SEED_DIR . DIRECTORY_SEPARATOR . $type . '.json';
        $contents = is_file($seed) ? file_get_contents($seed) : '[]';
        atomic_write($dest, $contents === false ? '[]' : $contents);
    }
}

// --- Locked JSON storage ---------------------------------------------------
// Read a content collection. Returns a plain PHP array of items.
function read_collection(string $type): array
{
    if (!in_array($type, $GLOBALS['CONTENT_TYPES'], true)) {
        json_error('Unknown content type', 400);
    }
    ensure_storage();
    $path = CONTENT_DIR . DIRECTORY_SEPARATOR . $type . '.json';

    $fh = fopen($path, 'r');
    if ($fh === false) {
        return [];
    }
    $data = [];
    if (flock($fh, LOCK_SH)) {
        $raw = stream_get_contents($fh);
        flock($fh, LOCK_UN);
        $decoded = json_decode($raw ?: '[]', true);
        $data = is_array($decoded) ? $decoded : [];
    }
    fclose($fh);
    return $data;
}

// Persist a content collection back to disk atomically under an exclusive lock.
function write_collection(string $type, array $items): void
{
    if (!in_array($type, $GLOBALS['CONTENT_TYPES'], true)) {
        json_error('Unknown content type', 400);
    }
    ensure_storage();
    $path = CONTENT_DIR . DIRECTORY_SEPARATOR . $type . '.json';
    $json = json_encode(
        array_values($items),
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    atomic_write($path, $json === false ? '[]' : $json);
}

// Write via a temp file + rename so a reader never sees a half-written file.
function atomic_write(string $path, string $contents): void
{
    $tmp = $path . '.tmp' . getmypid();
    $fh = fopen($tmp, 'w');
    if ($fh === false) {
        json_error('Could not write data', 500);
    }
    if (flock($fh, LOCK_EX)) {
        fwrite($fh, $contents);
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    if (!@rename($tmp, $path)) {
        @unlink($tmp);
        json_error('Could not save data', 500);
    }
}

// --- Small utilities -------------------------------------------------------
// Turn a title into a URL-friendly slug (used for new blog posts).
function slugify(string $text): string
{
    $text = trim($text);
    // Transliterate accented characters where the intl/iconv extension allows.
    if (function_exists('iconv')) {
        $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        if ($converted !== false) {
            $text = $converted;
        }
    }
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return $text === '' ? 'post' : $text;
}

// Next integer id for a collection.
function next_id(array $items): int
{
    $max = 0;
    foreach ($items as $item) {
        if (isset($item['id']) && (int) $item['id'] > $max) {
            $max = (int) $item['id'];
        }
    }
    return $max + 1;
}

// Ensure a slug is unique within a collection, ignoring the item with $ignoreId.
function unique_slug(array $items, string $slug, $ignoreId = null): string
{
    $existing = [];
    foreach ($items as $item) {
        if ($ignoreId !== null && isset($item['id']) && $item['id'] == $ignoreId) {
            continue;
        }
        if (isset($item['slug'])) {
            $existing[$item['slug']] = true;
        }
    }
    if (!isset($existing[$slug])) {
        return $slug;
    }
    $i = 2;
    while (isset($existing[$slug . '-' . $i])) {
        $i++;
    }
    return $slug . '-' . $i;
}

// --- Auth: signed tokens ---------------------------------------------------
// Load the auth record ({hash, secret}) created by set-password.php.
function load_auth(): ?array
{
    if (!is_file(AUTH_FILE)) {
        return null;
    }
    $data = json_decode(file_get_contents(AUTH_FILE) ?: 'null', true);
    if (!is_array($data) || empty($data['hash']) || empty($data['secret'])) {
        return null;
    }
    return $data;
}

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

// Issue a compact signed token: base64url(payload).base64url(hmac).
function issue_token(string $secret): string
{
    $payload = json_encode(['exp' => time() + TOKEN_TTL]);
    $body = base64url_encode($payload);
    $sig = base64url_encode(hash_hmac('sha256', $body, $secret, true));
    return $body . '.' . $sig;
}

// Validate the Authorization: Bearer token. Returns true if valid & unexpired.
function verify_token(string $secret): bool
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($header === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $header = $v;
                break;
            }
        }
    }
    if (stripos($header, 'Bearer ') !== 0) {
        return false;
    }
    $token = substr($header, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }
    [$body, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', $body, $secret, true));
    if (!hash_equals($expected, $sig)) {
        return false;
    }
    $payload = json_decode(base64url_decode($body) ?: 'null', true);
    if (!is_array($payload) || !isset($payload['exp'])) {
        return false;
    }
    return time() < (int) $payload['exp'];
}

// Guard an endpoint: exits with 401 unless a valid token is present.
function require_auth(): void
{
    $auth = load_auth();
    if ($auth === null) {
        json_error('Admin password not set. Run set-password.php first.', 503);
    }
    if (!verify_token($auth['secret'])) {
        json_error('Unauthorized', 401);
    }
}
