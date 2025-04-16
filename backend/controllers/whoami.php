<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'] ?? null
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
}
