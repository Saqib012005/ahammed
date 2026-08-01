<?php
// ---------------------------------------------------------------------------
// POST /api/upload.php   (auth)   multipart/form-data with field "file"
// Stores the image OUTSIDE the web root (uploads dir in the data folder) and
// returns { "media": "media.php?f=<id>", "id": "<id>" }. The returned value
// is stored as an item's image field; media.php streams it back publicly.
// ---------------------------------------------------------------------------

require __DIR__ . '/lib.php';
send_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}
require_auth();
ensure_storage();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_error('No file uploaded', 400);
}

$file = $_FILES['file'];
if ($file['size'] > MAX_UPLOAD_BYTES) {
    json_error('File too large (max 5 MB)', 413);
}

// Determine the real MIME type from the file contents, not the client claim.
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!isset($GLOBALS['ALLOWED_IMAGE_TYPES'][$mime])) {
    json_error('Unsupported image type', 415);
}
$ext = $GLOBALS['ALLOWED_IMAGE_TYPES'][$mime];

// Random, collision-free filename; original name is not trusted.
try {
    $id = bin2hex(random_bytes(16)) . '.' . $ext;
} catch (Exception $e) {
    $id = uniqid('img_', true) . '.' . $ext;
}
$dest = UPLOADS_DIR . DIRECTORY_SEPARATOR . $id;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_error('Could not store upload', 500);
}
@chmod($dest, 0644);

json_response([
    'id'    => $id,
    'media' => 'media.php?f=' . rawurlencode($id),
], 201);
