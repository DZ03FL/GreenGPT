<?php
session_start();
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5000");
header("Access-Control-Allow-Origin: https://greengpt.onrender.com"); 
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'username' => $_SESSION['username']
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>