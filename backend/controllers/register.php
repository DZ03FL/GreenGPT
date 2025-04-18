<?php
session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    // Validates if required input fields are filled
    if (empty($email) || empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing fields']);
        exit;
    }

    // Do password hashing later
    $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User registered']);
    } 
    else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'User registration failed']);
    }
}
?>