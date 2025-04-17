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
$friendshipId = intval($data['friendship_id']);
$action = $data['action']; // "accept" or "decline

if (!in_array($action, ['accept', 'decline'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM friends WHERE friendship_id = ? AND user_id_2 = ?");
$stmt->bind_param("ii", $friendshipId, $currentUserId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Not authorized to respond to this request']);
    exit;
}

$status = ($action === 'accept') ? 'accepted' : 'declined';
$stmt = $conn->prepare("UPDATE friends SET status = ? WHERE friendship_id = ?");
$stmt->bind_param("si", $status, $friendshipId);

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'No pending friend request from this user']);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => "Friend request $status"]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update request']);
}
?>
