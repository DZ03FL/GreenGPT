<?php
session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>