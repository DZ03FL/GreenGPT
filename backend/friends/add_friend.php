<?php
session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$currentUserId = $_SESSION['user_id'];
$targetUsername = trim($data['username'] ?? '');

if (empty($targetUsername)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username is required']);
    exit;
}

$currentUserId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$stmt->bind_param("s", $targetUsername);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$targetUser = $result->fetch_assoc();
$targetUserId = $targetUser['user_id'];

if ($targetUserId == $currentUserId) {
    http_response_code(400);
    echo json_encode(['error' => 'Cannot send friend request to yourself']);
    exit;
}

$stmt = $conn->prepare("
    SELECT * FROM friends 
    WHERE 
      (user_id_1 = ? AND user_id_2 = ?)  OR
    (user_id_1 = ? AND user_id_2 = ?)
");
$stmt->bind_param("iiii", $currentUserId, $targetUserId, $targetUserId, $currentUserId);
$stmt->execute();
$existing = $stmt->get_result();

if ($existing->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Friend request already sent or users are already friends']);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO friends (user_id_1, user_id_2, status) 
    VALUES (?, ?, 'pending')
");
$stmt->bind_param("ii", $currentUserId, $targetUserId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Friend request sent']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send friend request']);
}
?>
