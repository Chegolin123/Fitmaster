<?php
header("Access-Control-Allow-Origin: https://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = '';

if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
}

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'avatar'");
    $columnExists = $stmt->fetch();
    
    if (!$columnExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL");
    }
    
    $stmt = $pdo->prepare("SELECT avatar FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $avatar = $stmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'avatar_url' => $avatar ?: null
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>