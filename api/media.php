<?php
// ---------------------------------------------------------------------------
// GET /api/media.php?f=<id>   public image passthrough.
// Serves an uploaded image that lives OUTSIDE the web root. This keeps client
// uploads safe from git auto-deploys while still making them publicly viewable.
// ---------------------------------------------------------------------------

require __DIR__ . '/config.php';

$f = $_GET['f'] ?? '';

// Only allow the exact filenames upload.php produces: 32 hex chars + ext.
// This defeats path traversal (../) and access to anything else.
if (!preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/', $f)) {
    http_response_code(400);
    exit('Bad request');
}

$path = UPLOADS_DIR . DIRECTORY_SEPARATOR . $f;
if (!is_file($path)) {
    http_response_code(404);
    exit('Not found');
}

$ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
$mimes = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif'];
$mime = $mimes[$ext] ?? 'application/octet-stream';

// Conditional request support so browsers can cache aggressively.
$etag = '"' . md5_file($path) . '"';
$ifNoneMatch = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';

header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=31536000, immutable');
header('ETag: ' . $etag);

if ($ifNoneMatch !== '' && trim($ifNoneMatch) === $etag) {
    http_response_code(304);
    exit;
}

header('Content-Length: ' . filesize($path));
readfile($path);
