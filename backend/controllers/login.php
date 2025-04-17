<?php
// Start the session and set cookie parameters to ensure the session does not expire immediately
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax',
]);

session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$identifier = $input['identifier'] ?? '';
$password = $input['password'] ?? '';

$response = ['success' => false, 'message' => ''];

if (!$identifier || !$password) {
    http_response_code(400);
    $response['message'] = 'Missing fields';
    echo json_encode($response);
    exit;
}

// Check if the user exists in the database before attempting to log in
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $identifier, $identifier);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    $response['message'] = 'User not found';
} 
else {
    $user = $result->fetch_assoc();
    if ($password == $user['password']) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];

        $response['success'] = true;
        $response['message'] = 'Logged in successfully';
        $response['username'] = $user['username'];
    } 
    else {
        http_response_code(401);
        $response['message'] = 'Invalid password';
    }
}

echo json_encode($response);
?>