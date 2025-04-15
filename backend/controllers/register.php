<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    // Do password hashing later
    $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $password);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'User registered']);
    } 
    else {
        http_response_code(500);
        echo json_encode(['error' => 'User registration failed']);
    }
}