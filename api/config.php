<?php
// ---------------------------------------------------------------------------
// Central configuration for the content API.
//
// IMPORTANT: no secrets are committed in this file. The admin password hash
// and the token-signing secret live in auth.json inside the DATA directory,
// which sits OUTSIDE the public web root so that git auto-deploys can never
// overwrite or expose it. Create it once by running set-password.php.
// ---------------------------------------------------------------------------

// --- Data directory (content JSON + uploads + auth) ------------------------
// Kept outside the web root. On Hostinger shared hosting the site is served
// from ~/public_html, so this resolves to ~/thecopystudio_data (a sibling of
// public_html that redeploys never touch). Override with the CONTENT_DATA_DIR
// environment variable for local development.
$__envDir = getenv('CONTENT_DATA_DIR');
if ($__envDir !== false && $__envDir !== '') {
    define('DATA_DIR', rtrim($__envDir, "/\\"));
} else {
    // __DIR__ = public_html/api  ->  dirname twice = parent of public_html
    define('DATA_DIR', dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'thecopystudio_data');
}

define('CONTENT_DIR', DATA_DIR . DIRECTORY_SEPARATOR . 'content');
define('UPLOADS_DIR', DATA_DIR . DIRECTORY_SEPARATOR . 'uploads');
define('AUTH_FILE',   DATA_DIR . DIRECTORY_SEPARATOR . 'auth.json');
define('SEED_DIR',    __DIR__  . DIRECTORY_SEPARATOR . 'seed');

// Content types this API manages. These are the accepted ?type= values and
// map 1:1 to <type>.json files in the content directory / seed directory.
$GLOBALS['CONTENT_TYPES'] = ['blogs', 'projects', 'services', 'testimonials'];

// Signed-token lifetime in seconds. The client must log in again after this.
define('TOKEN_TTL', 60 * 60 * 8); // 8 hours

// Accepted image upload MIME types mapped to the extension we store them as.
$GLOBALS['ALLOWED_IMAGE_TYPES'] = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

// Maximum accepted upload size.
define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024); // 5 MB
