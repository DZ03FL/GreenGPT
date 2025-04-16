<?php
session_start();
require './db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$result = $conn->query("SELECT * FROM users");

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
    exit;
}
$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}


echo json_encode($users);
?>