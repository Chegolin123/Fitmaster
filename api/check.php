<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';

$token = isset($_GET['token']) ? $_GET['token'] : '';

if (!$token) {
    echo json_encode(['valid' => false]);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo json_encode([
            'valid' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode(['valid' => false]);
    }
    
} catch (Exception $e) {
    echo json_encode(['valid' => false, 'error' => $e->getMessage()]);
}
?>