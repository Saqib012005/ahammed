<?php
// ---------------------------------------------------------------------------
// POST /api/login.php  { "password": "..." }
// Verifies the single admin password (bcrypt) with a constant-time check and
// returns a short-lived signed token used to authorize write operations.
// ---------------------------------------------------------------------------

require __DIR__ . '/lib.php';
send_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$auth = load_auth();
if ($auth === null) {
    json_error('Admin password not set. Run set-password.php first.', 503);
}

$body = read_json_body();
$password = isset($body['password']) ? (string) $body['password'] : '';

// A tiny artificial delay blunts brute-force attempts on shared hosting.
usleep(250000);

if ($password === '' || !password_verify($password, $auth['hash'])) {
    json_error('Incorrect password', 401);
}

json_response([
    'token'      => issue_token($auth['secret']),
    'expires_in' => TOKEN_TTL,
]);
