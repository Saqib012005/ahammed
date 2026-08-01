<?php
// ---------------------------------------------------------------------------
// ONE-TIME SETUP HELPER — DELETE THIS FILE AFTER YOU HAVE USED IT.
//
// Sets the single admin password. It writes {hash, secret} to auth.json which
// lives OUTSIDE the web root (in the data folder), so it survives redeploys and
// is never web-accessible. The password is stored only as a bcrypt hash; the
// plaintext is never saved. A random signing secret is generated for tokens.
//
// Usage (either works):
//   1. Visit  https://your-domain/api/set-password.php?password=YOUR_PASSWORD
//   2. Or POST JSON  { "password": "YOUR_PASSWORD" }  to the same URL.
//
// By default it refuses to overwrite an existing password. Append &force=1 to
// deliberately reset it. When finished, DELETE this file from the server.
// ---------------------------------------------------------------------------

require __DIR__ . '/lib.php';
send_cors_headers();

ensure_storage();

$password = '';
if (isset($_GET['password'])) {
    $password = (string) $_GET['password'];
} else {
    $body = read_json_body();
    if (isset($body['password'])) {
        $password = (string) $body['password'];
    }
}
$password = trim($password);

$force = isset($_GET['force']) && $_GET['force'] === '1';

if ($password === '') {
    json_error('Provide a password: ?password=YOUR_PASSWORD (min 8 characters).', 400);
}
if (strlen($password) < 8) {
    json_error('Password too short — use at least 8 characters.', 400);
}

if (is_file(AUTH_FILE) && !$force) {
    $existing = load_auth();
    if ($existing !== null) {
        json_error('A password is already set. Append &force=1 to overwrite it.', 409);
    }
}

// Reuse the existing signing secret if present so live tokens keep working;
// otherwise generate a fresh one.
$secret = null;
$existing = load_auth();
if ($existing !== null && !empty($existing['secret'])) {
    $secret = $existing['secret'];
}
if ($secret === null) {
    try {
        $secret = bin2hex(random_bytes(32));
    } catch (Exception $e) {
        $secret = hash('sha256', uniqid('', true) . microtime());
    }
}

$record = [
    'hash'   => password_hash($password, PASSWORD_BCRYPT),
    'secret' => $secret,
];

atomic_write(AUTH_FILE, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

json_response([
    'ok'      => true,
    'message' => 'Password set. IMPORTANT: delete set-password.php from the server now.',
]);
