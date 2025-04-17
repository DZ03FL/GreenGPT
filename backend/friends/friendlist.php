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

$currentUserId = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT u.user_id, u.username, u.email
    FROM friends f
    JOIN users u ON (
        (f.user_id_1 = ? AND f.user_id_2 = u.user_id) OR 
        (f.user_id_2 = ? AND f.user_id_1 = u.user_id)
    )
    WHERE f.status = 'accepted'
");
$stmt->bind_param("ii", $currentUserId, $currentUserId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $friends = [];

    while ($row = $result->fetch_assoc()) {
        $friends[] = $row;
    }

    echo json_encode($friends);
} 
else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch friends']);
}
?>
