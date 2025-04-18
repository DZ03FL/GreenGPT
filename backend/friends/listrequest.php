<?php
session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Origin: https://greengpt.onrender.com"); 
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$currentUserId = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT f.friendship_id, u.user_id AS sender_id, u.username, u.email, f.timestamp
    FROM friends f
    JOIN users u ON f.user_id_1 = u.user_id
    WHERE f.user_id_2 = ? AND f.status = 'pending'
");

$stmt->bind_param("i", $currentUserId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $requests = [];

    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    echo json_encode($requests);
} 
else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch friend requests']);
}
?>
